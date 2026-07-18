-- LinkedIn OAuth connection storage (Phase 2)
-- Safe metadata is readable by the owner via RLS.
-- OAuth tokens are server-only (no client policies).

create table if not exists public.linkedin_connections (
  user_id uuid primary key references auth.users (id) on delete cascade,
  linkedin_member_id text not null,
  display_name text,
  email text,
  profile_picture_url text,
  connected_at timestamptz not null default timezone('utc', now()),
  last_synced_at timestamptz,
  token_expires_at timestamptz not null,
  status text not null default 'connected'
    check (status in ('connected', 'expired', 'revoked')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists linkedin_connections_member_id_idx
  on public.linkedin_connections (linkedin_member_id);

create index if not exists linkedin_connections_status_idx
  on public.linkedin_connections (status);

create table if not exists public.linkedin_oauth_tokens (
  user_id uuid primary key references auth.users (id) on delete cascade,
  access_token text not null,
  refresh_token text,
  token_type text not null default 'Bearer',
  scope text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.linkedin_connections enable row level security;
alter table public.linkedin_oauth_tokens enable row level security;

create policy "Users read own LinkedIn connection metadata"
  on public.linkedin_connections
  for select
  using (auth.uid() = user_id);

-- Tokens are never exposed to the browser — service role only.
revoke all on table public.linkedin_oauth_tokens from anon, authenticated;
revoke all on table public.linkedin_oauth_tokens from public;

grant select on table public.linkedin_connections to authenticated;

create or replace function public.set_linkedin_connections_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists linkedin_connections_set_updated_at on public.linkedin_connections;

create trigger linkedin_connections_set_updated_at
before update on public.linkedin_connections
for each row
execute function public.set_linkedin_connections_updated_at();

create or replace function public.set_linkedin_oauth_tokens_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists linkedin_oauth_tokens_set_updated_at on public.linkedin_oauth_tokens;

create trigger linkedin_oauth_tokens_set_updated_at
before update on public.linkedin_oauth_tokens
for each row
execute function public.set_linkedin_oauth_tokens_updated_at();
