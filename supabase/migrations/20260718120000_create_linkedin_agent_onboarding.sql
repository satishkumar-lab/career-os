-- AI LinkedIn Agent – onboarding foundation (Sprint 1)
-- Run this migration in your Supabase project before using the module.

create table if not exists public.linkedin_agent_onboarding (
  user_id uuid primary key references auth.users (id) on delete cascade,
  onboarding_completed boolean not null default false,
  onboarding_skipped boolean not null default false,
  onboarding_skipped_at timestamptz,
  career text,
  experience text,
  goal text,
  tone text,
  posting_frequency text,
  location text,
  niche text,
  -- Extensible JSON for future LinkedIn profile fields, AI metadata, OAuth tokens, etc.
  profile_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists linkedin_agent_onboarding_completed_idx
  on public.linkedin_agent_onboarding (onboarding_completed);

create index if not exists linkedin_agent_onboarding_skipped_idx
  on public.linkedin_agent_onboarding (onboarding_skipped);

alter table public.linkedin_agent_onboarding enable row level security;

create policy "Users can view their LinkedIn agent onboarding"
  on public.linkedin_agent_onboarding
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their LinkedIn agent onboarding"
  on public.linkedin_agent_onboarding
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their LinkedIn agent onboarding"
  on public.linkedin_agent_onboarding
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_linkedin_agent_onboarding_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists linkedin_agent_onboarding_set_updated_at
  on public.linkedin_agent_onboarding;

create trigger linkedin_agent_onboarding_set_updated_at
before update on public.linkedin_agent_onboarding
for each row
execute function public.set_linkedin_agent_onboarding_updated_at();
