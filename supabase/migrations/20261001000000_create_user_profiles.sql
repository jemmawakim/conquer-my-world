-- user_profiles: one row per auth user. RLS is mandatory for every table.

create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) between 2 and 50),
  avatar_url text,
  bio text check (char_length(bio) <= 280),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.user_profiles force row level security;

create policy "user_profiles_select_own"
  on public.user_profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "user_profiles_insert_own"
  on public.user_profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "user_profiles_update_own"
  on public.user_profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No delete policy: rows are removed only via the auth.users cascade.

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- Create a profile automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
