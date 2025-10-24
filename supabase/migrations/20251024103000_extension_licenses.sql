create extension if not exists "pgcrypto";

create table if not exists extension_licenses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    license_hash text not null unique,
    plan_type subscription_tier not null,
    status text not null default 'active',
    issued_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    expires_at timestamptz,
    last_validated_at timestamptz,
    token_prefix text not null,
    license_hint text not null,
    notes text
);

create unique index if not exists extension_licenses_user_idx on extension_licenses(user_id);
create index if not exists extension_licenses_plan_idx on extension_licenses(plan_type);

alter table extension_licenses
  add constraint extension_license_status_check
  check (status in ('active', 'revoked', 'expired'));

create or replace function public.set_extension_license_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger set_extension_license_updated_at
  before update on extension_licenses
  for each row
  execute function public.set_extension_license_updated_at();

alter table extension_licenses enable row level security;

create policy "Users can view their own license"
  on extension_licenses
  for select
  using (auth.uid() = user_id);

create policy "Service role manages licenses"
  on extension_licenses
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
