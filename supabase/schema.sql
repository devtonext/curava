-- =====================================================================
--  Curava template — Supabase schema
--  Safe to run more than once. Paste into Supabase → SQL Editor → Run.
--  (supabase/setup.sql = this file + demo content, in one go.)
-- =====================================================================


-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- Admins
-- The FIRST account that signs up (from /admin/login) becomes admin
-- automatically. Add more admins later with:
--   insert into public.admin_users (user_id, email)
--   select id, email from auth.users where email = 'teammate@example.com';
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users);
$$;

create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admin_users) then
    insert into public.admin_users (user_id, email) values (new.id, new.email);
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created_first_admin on auth.users;
create trigger on_auth_user_created_first_admin
  after insert on auth.users
  for each row execute function public.handle_first_admin();

alter table public.admin_users enable row level security;
drop policy if exists "Admins read admins" on public.admin_users;
create policy "Admins read admins" on public.admin_users
  for select to authenticated using (public.is_admin() or user_id = auth.uid());
drop policy if exists "Admins manage admins" on public.admin_users;
create policy "Admins manage admins" on public.admin_users
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Page content: one JSON document per section (hero, contact, seo, …)
-- ---------------------------------------------------------------------
create table if not exists public.site_content (
  key        text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
drop policy if exists "Public read content" on public.site_content;
create policy "Public read content" on public.site_content for select using (true);
drop policy if exists "Admin write content" on public.site_content;
create policy "Admin write content" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop trigger if exists set_updated_at on public.site_content;
create trigger set_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Collections (lists managed in the dashboard)
-- Every collection has: id, sort_order, published, created_at, updated_at
-- ---------------------------------------------------------------------
create table if not exists public.features (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text,
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  value numeric not null default 0,
  prefix text default '',
  suffix text default '',
  label text not null,
  tone text not null default 'default' check (tone in ('default', 'purple', 'yellow')),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  years int,
  categories text[] not null default '{}',
  bio text,
  image_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  meta text,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),
  avatar_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text,
  tone text not null default 'default' check (tone in ('default', 'purple', 'yellow')),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text not null,
  period text default '/month',
  description text,
  features text[] not null default '{}',
  highlighted boolean not null default false,
  cta_label text default 'Get started',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  category text,
  author text,
  read_minutes int default 5,
  image_url text,
  featured boolean not null default false,
  published_at date default current_date,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text,
  tone text not null default 'default' check (tone in ('default', 'purple', 'yellow')),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  text text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Same rules for every collection: anyone reads published rows, admins do everything.
do $$
declare t text;
begin
  foreach t in array array['features','stats','doctors','reviews','programs','plans','steps','faqs','articles','company_values','milestones','partners'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public read published" on public.%I', t);
    execute format('create policy "Public read published" on public.%I for select using (published or public.is_admin())', t);
    execute format('drop policy if exists "Admin full access" on public.%I', t);
    execute format('create policy "Admin full access" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
    execute format('create index if not exists %I on public.%I (sort_order)', t || '_sort_idx', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Submissions from the website (visitors can insert, only admins read)
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 200),
  email text not null check (char_length(email) <= 320),
  topic text check (char_length(topic) <= 200),
  message text not null check (char_length(message) <= 5000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 200),
  phone text not null check (char_length(phone) <= 50),
  email text not null check (char_length(email) <= 320),
  program text,
  specialist text,
  preferred_date date,
  preferred_time text,
  notes text check (char_length(notes) <= 3000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 320),
  created_at timestamptz not null default now()
);

create index if not exists messages_created_idx on public.messages (created_at desc);
create index if not exists appointments_created_idx on public.appointments (created_at desc);

alter table public.messages enable row level security;
alter table public.appointments enable row level security;
alter table public.subscribers enable row level security;

drop policy if exists "Anyone can send a message" on public.messages;
create policy "Anyone can send a message" on public.messages
  for insert to anon, authenticated with check (status = 'new');
drop policy if exists "Admins manage messages" on public.messages;
create policy "Admins manage messages" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone can request an appointment" on public.appointments;
create policy "Anyone can request an appointment" on public.appointments
  for insert to anon, authenticated with check (status = 'pending');
drop policy if exists "Admins manage appointments" on public.appointments;
create policy "Admins manage appointments" on public.appointments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe" on public.subscribers
  for insert to anon, authenticated with check (true);
drop policy if exists "Admins manage subscribers" on public.subscribers;
create policy "Admins manage subscribers" on public.subscribers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: public "media" bucket for images uploaded from the dashboard
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media" on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "Admins update media" on storage.objects;
create policy "Admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "Admins delete media" on storage.objects;
create policy "Admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
