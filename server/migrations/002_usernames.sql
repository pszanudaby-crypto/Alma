alter table users add column if not exists username text;

update users
set username = lower(split_part(email, '@', 1))
where username is null;

create unique index if not exists users_username_lower_idx
  on users (lower(username))
  where username is not null;
