-- warranty_registrations: one row per activated product warranty. RLS is mandatory.

create table public.warranty_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_name text not null check (char_length(product_name) between 2 and 100),
  serial_number text not null unique check (serial_number ~ '^[A-Z0-9-]{6,40}$'),
  purchase_date date not null check (
    purchase_date <= current_date + 1
    and purchase_date >= current_date - interval '5 years'
  ),
  retailer text check (char_length(retailer) <= 100),
  -- Set by the database, never by the client (see column grants below).
  warranty_months smallint not null default 12 check (warranty_months between 1 and 120),
  expires_on date generated always as (
    (purchase_date + warranty_months * interval '1 month')::date
  ) stored,
  activated_at timestamptz not null default now()
);

create index warranty_registrations_user_id_idx on public.warranty_registrations (user_id);

alter table public.warranty_registrations enable row level security;
alter table public.warranty_registrations force row level security;

create policy "warranty_registrations_select_own"
  on public.warranty_registrations for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "warranty_registrations_insert_own"
  on public.warranty_registrations for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- No update/delete policies: an activated warranty is immutable for the owner.

-- Column-level privileges: clients may only supply these four columns.
-- user_id comes from auth.uid(); warranty_months and timestamps from defaults.
revoke all on public.warranty_registrations from anon, authenticated;
grant select on public.warranty_registrations to authenticated;
grant insert (product_name, serial_number, purchase_date, retailer)
  on public.warranty_registrations to authenticated;
