-- Profiles extends auth.users
create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  email text unique,
  name text,
  company text,
  plan text default 'free',
  created_at timestamptz default now()
);

-- Calculations
create table if not exists calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  domain text not null,
  inputs jsonb,
  outputs jsonb,
  created_at timestamptz default now()
);

-- Downloads
create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  report_name text not null,
  domain text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_calculations_user on calculations(user_id);
create index if not exists idx_downloads_user on downloads(user_id);


