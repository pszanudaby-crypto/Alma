create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  display_name text,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  constraint users_role_check check (role in ('user', 'admin'))
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text,
  media_url text,
  author_id uuid not null references users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts (id) on delete cascade,
  user_id uuid not null references users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists schema_migrations (
  id text primary key,
  applied_at timestamptz not null default now()
);

create index if not exists idx_posts_created_at on posts (created_at desc);
create index if not exists idx_posts_author_id on posts (author_id);
create index if not exists idx_comments_post_id on comments (post_id);
create index if not exists idx_comments_created_at on comments (created_at);
create index if not exists idx_comments_user_id on comments (user_id);
