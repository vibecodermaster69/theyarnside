alter table public.orders
  add column if not exists policy_version text,
  add column if not exists policy_accepted_at timestamptz;

drop function if exists public.create_order(text, text, text, text, text, jsonb);

create or replace function public.create_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_delivery_address text,
  p_notes text,
  p_policy_version text,
  p_policy_accepted_at timestamptz,
  p_items jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id bigint;
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
  v_total integer := 0;
begin
  if nullif(trim(p_policy_version), '') is null or p_policy_accepted_at is null then
    raise exception 'Returns, Refunds & Order Policy must be accepted';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart cannot be empty';
  end if;

  insert into public.orders (customer_name, customer_email, customer_phone, delivery_address, notes, policy_version, policy_accepted_at, total_inr)
  values (trim(p_customer_name), nullif(trim(p_customer_email), ''), trim(p_customer_phone), trim(p_delivery_address), nullif(trim(p_notes), ''), trim(p_policy_version), p_policy_accepted_at, 0)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity is null or v_quantity < 1 then raise exception 'Invalid item quantity'; end if;
    select * into v_product from public.products where id = (v_item->>'product_id')::bigint and is_active = true for update;
    if not found then raise exception 'Product is no longer available'; end if;
    if v_product.stock_quantity < v_quantity then raise exception 'Not enough stock for %', v_product.name; end if;
    update public.products set stock_quantity = stock_quantity - v_quantity, updated_at = now() where id = v_product.id;
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price_inr) values (v_order_id, v_product.id, v_product.name, v_quantity, v_product.price_inr);
    v_total := v_total + (v_product.price_inr * v_quantity);
  end loop;
  update public.orders set total_inr = v_total, updated_at = now() where id = v_order_id;
  return v_order_id;
end;
$$;

grant execute on function public.create_order(text, text, text, text, text, text, timestamptz, jsonb) to anon, authenticated;
