-- Run this migration in Supabase SQL Editor to enable the admin cancellation button.
alter table public.orders
  add column if not exists stock_restored_at timestamptz;

create or replace function public.cancel_order(p_order_id bigint)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item public.order_items%rowtype;
begin
  if not exists (select 1 from public.admin_users where user_id = auth.uid()) then
    raise exception 'Only admins can cancel orders';
  end if;

  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found';
  end if;

  -- The row lock plus status check makes this safe against double clicks.
  if v_order.stock_restored_at is null then
    for v_item in
      select * from public.order_items where order_id = p_order_id
    loop
      update public.products
      set stock_quantity = stock_quantity + v_item.quantity,
          updated_at = now()
      where id = v_item.product_id;
    end loop;

    update public.orders
    set status = 'cancelled',
        stock_restored_at = coalesce(stock_restored_at, now()),
        updated_at = now()
    where id = p_order_id
    returning * into v_order;
  end if;

  return v_order;
end;
$$;

revoke execute on function public.cancel_order(bigint) from public, anon;
grant execute on function public.cancel_order(bigint) to authenticated;
