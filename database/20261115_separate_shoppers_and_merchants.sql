-- Separate ordinary accounts from actual store owners in admin reporting.
create or replace function public.admin_dashboard_stats()
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare result jsonb;
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role','') <> 'admin' then
    raise exception 'not authorized';
  end if;
  select jsonb_build_object(
    'accounts', (select count(*) from auth.users),
    'merchants', (select count(distinct owner_id) from public.stores),
    'stores', (select count(*) from public.stores),
    'published_stores', (select count(*) from public.stores where is_published),
    'products', (select count(*) from public.products),
    'orders', (select count(*) from public.orders),
    'pending_payments', (select count(*) from public.subscription_payment_requests where status='pending'),
    'open_support', (select count(*) from public.support_messages where status in ('open','in_progress')),
    'subscriptions', (select count(*) from public.user_subscriptions where plan in ('pro','premium') and status in ('active','trialing'))
  ) into result;
  return result;
end;
$function$;

create or replace function public.admin_list_merchants()
returns table(user_id uuid, email text, full_name text, store_id uuid, store_name text, is_published boolean, plan text, subscription_status text, billing_cycle text, current_period_ends_at timestamp with time zone, created_at timestamp with time zone)
language plpgsql
security definer
set search_path to ''
as $function$
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role','') <> 'admin' then
    raise exception 'not authorized';
  end if;
  return query
  select u.id, u.email::text, p.full_name, s.id, s.store_name, s.is_published,
         coalesce(us.plan,'free'), coalesce(us.status,'free'), us.billing_cycle,
         us.current_period_ends_at, u.created_at
  from auth.users u
  join public.stores s on s.owner_id=u.id
  left join public.profiles p on p.id=u.id
  left join public.user_subscriptions us on us.user_id=u.id
  order by u.created_at desc;
end;
$function$;
