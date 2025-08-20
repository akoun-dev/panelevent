create table if not exists registration_tokens (
  id text primary key default gen_random_uuid()::text,
  token text unique not null,
  event_id text references events(id) on delete cascade,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
