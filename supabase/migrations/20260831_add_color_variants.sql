-- Add per-colour inventory and optional colour-specific product images.
alter table public.products
  add column if not exists color_variants jsonb not null default '[]'::jsonb;

alter table public.order_items
  add column if not exists variant_name text;

-- Existing products keep their current stock. Products with variants use the
-- sum of their variant quantities as the legacy stock total.
update public.products
set stock_quantity = coalesce((
  select sum(greatest(0, coalesce((variant->>'stockQuantity')::integer, (variant->>'stock_quantity')::integer, 0)))
  from jsonb_array_elements(color_variants) as variant
), 0)
where jsonb_typeof(color_variants) = 'array' and jsonb_array_length(color_variants) > 0;

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
returns bigint language plpgsql security definer set search_path = public
as $$
declare
  v_order_id bigint;
  v_item jsonb;
  v_product public.products%rowtype;
  v_variant jsonb;
  v_variants jsonb;
  v_quantity integer;
  v_variant_name text;
  v_variant_stock integer;
  v_total integer := 0;
begin
  if nullif(trim(p_policy_version), '') is null or p_policy_accepted_at is null then raise exception 'Returns, Refunds & Order Policy must be accepted'; end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then raise exception 'Cart cannot be empty'; end if;
  insert into public.orders (customer_name, customer_email, customer_phone, delivery_address, notes, policy_version, policy_accepted_at, total_inr)
  values (trim(p_customer_name), nullif(trim(p_customer_email), ''), trim(p_customer_phone), trim(p_delivery_address), nullif(trim(p_notes), ''), trim(p_policy_version), p_policy_accepted_at, 0)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity is null or v_quantity < 1 then raise exception 'Invalid item quantity'; end if;
    select * into v_product from public.products where id = (v_item->>'product_id')::bigint and is_active = true for update;
    if not found then raise exception 'Product is no longer available'; end if;
    v_variant_name := nullif(trim(v_item->>'variant_name'), '');

    if jsonb_typeof(v_product.color_variants) = 'array' and jsonb_array_length(v_product.color_variants) > 0 then
      if v_variant_name is null then raise exception 'Please choose a colour for %', v_product.name; end if;
      select value into v_variant from jsonb_array_elements(v_product.color_variants) where lower(value->>'name') = lower(v_variant_name) limit 1;
      if v_variant is null then raise exception 'Selected colour is not available for %', v_product.name; end if;
      v_variant_stock := greatest(0, coalesce((v_variant->>'stockQuantity')::integer, (v_variant->>'stock_quantity')::integer, 0));
      if v_variant_stock < v_quantity then raise exception 'Not enough stock for % in colour %', v_product.name, v_variant_name; end if;
      select jsonb_agg(case when lower(value->>'name') = lower(v_variant_name) then jsonb_set(jsonb_set(value, '{stockQuantity}', to_jsonb(v_variant_stock - v_quantity), true), '{stock_quantity}', 'null'::jsonb, true) else value end)
      into v_variants from jsonb_array_elements(v_product.color_variants);
      update public.products set color_variants = v_variants, stock_quantity = coalesce((select sum(greatest(0, coalesce((variant->>'stockQuantity')::integer, 0))) from jsonb_array_elements(v_variants) as variant), 0), updated_at = now() where id = v_product.id;
    else
      if v_variant_name is not null then raise exception 'This product has no colour variants'; end if;
      if v_product.stock_quantity < v_quantity then raise exception 'Not enough stock for %', v_product.name; end if;
      update public.products set stock_quantity = stock_quantity - v_quantity, updated_at = now() where id = v_product.id;
    end if;
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price_inr, variant_name) values (v_order_id, v_product.id, v_product.name, v_quantity, v_product.price_inr, v_variant_name);
    v_total := v_total + (v_product.price_inr * v_quantity);
  end loop;
  update public.orders set total_inr = v_total, updated_at = now() where id = v_order_id;
  return v_order_id;
end;
$$;

grant execute on function public.create_order(text, text, text, text, text, text, timestamptz, jsonb) to anon, authenticated;

create or replace function public.cancel_order(p_order_id bigint)
returns public.orders language plpgsql security definer set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item public.order_items%rowtype;
  v_product public.products%rowtype;
  v_variants jsonb;
  v_variant jsonb;
  v_stock integer;
begin
  if not exists (select 1 from public.admin_users where user_id = auth.uid()) then raise exception 'Only admins can cancel orders'; end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.stock_restored_at is null then
    for v_item in select * from public.order_items where order_id = p_order_id loop
      select * into v_product from public.products where id = v_item.product_id for update;
      if v_item.variant_name is not null and jsonb_typeof(v_product.color_variants) = 'array' and jsonb_array_length(v_product.color_variants) > 0 then
        select value into v_variant from jsonb_array_elements(v_product.color_variants) where lower(value->>'name') = lower(v_item.variant_name) limit 1;
        if v_variant is not null then
          v_stock := greatest(0, coalesce((v_variant->>'stockQuantity')::integer, 0)) + v_item.quantity;
          select jsonb_agg(case when lower(value->>'name') = lower(v_item.variant_name) then jsonb_set(value, '{stockQuantity}', to_jsonb(v_stock), true) else value end) into v_variants from jsonb_array_elements(v_product.color_variants);
          update public.products set color_variants = v_variants, stock_quantity = coalesce((select sum(greatest(0, coalesce((variant->>'stockQuantity')::integer, 0))) from jsonb_array_elements(v_variants) as variant), 0), updated_at = now() where id = v_product.id;
        end if;
      else
        update public.products set stock_quantity = stock_quantity + v_item.quantity, updated_at = now() where id = v_item.product_id;
      end if;
    end loop;
    update public.orders set status = 'cancelled', stock_restored_at = now(), updated_at = now() where id = p_order_id returning * into v_order;
  end if;
  return v_order;
end;
$$;

revoke execute on function public.cancel_order(bigint) from public, anon;
grant execute on function public.cancel_order(bigint) to authenticated;
notify pgrst, 'reload schema';
