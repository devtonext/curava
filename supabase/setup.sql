-- ONE-CLICK SETUP: schema + demo content. Paste everything into Supabase → SQL Editor → Run.

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


-- =====================================================================
--  Curava template — demo content (generated by scripts/build-sql.mjs)
--  Only fills empty tables, so it never overwrites your edits.
-- =====================================================================

-- Page sections
insert into public.site_content (key, data) values ('general', '{"brand_name":"Curava","brand_tagline":"Precision care, human touch","primary_color":"#5a47cf","accent_color":"#fff27d","announcement_enabled":true,"announcement_text":"New: evening screenings now available at all four clinics.","announcement_link":"/contact?tab=book","footer_note":"Curava Health. All rights reserved."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('seo', '{"meta_title":"Curava — Precision care, human touch","meta_description":"Curava pairs data-driven diagnostics with specialists who listen, so you get care that''s built around you.","og_image":"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&h=630&q=80"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('contact', '{"phone":"+1 (800) 555-0199","email":"hello@curava.health","address":"210 Meridian Ave, Suite 4, Austin TX","hours":"Mon–Fri 7am–9pm · Sat 8am–2pm","map_embed_url":"https://www.openstreetmap.org/export/embed.html?bbox=-97.76%2C30.25%2C-97.72%2C30.28&layer=mapnik","instagram":"https://instagram.com","linkedin":"https://linkedin.com","x":"https://x.com","facebook":""}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_hero', '{"title":"Care That\nThinks Ahead.","subtitle":"Data-led diagnostics and specialists who actually listen — so every decision about your health starts with the full picture.","cta_label":"Talk to us","cta_link":"/contact","image_url":"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&h=1100&q=80","circle_label":"Explore Programs","circle_link":"/programs","stat_value":94.7,"stat_prefix":"+","stat_suffix":"%","stat_caption":"Early-detection accuracy across our screening panels","stat_image_url":"https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&w=700&h=700&q=80"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_features', '{"tags":["Genomics","Specialists"],"title":"The quiet signals your body sends — finally decoded.","text":"We translate lab results into plain language and a clear next step, reviewed by a specialist within 48 hours.","cta_label":"See how it works","cta_link":"/programs"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('home_sections', '{"marquee":["Smarter diagnostics","Human-first care"],"partners_title":"Trusted by leading labs, insurers and research partners","stats_title":"Numbers that\nkeep us honest.","stats_text":"Every metric below is tracked quarterly and shared openly with our patient community.","specialists_title":"Meet the people\nbehind your care.","specialists_cta":"All specialists","reviews_title":"What our patients\ntell their friends","insights_title":"Fresh from\nthe journal.","cta_title":"Reach out,\nwe''ll take it from here"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('programs_page', '{"title":"Programs built\naround your life.","intro":"Pick a starting point. Every program includes a specialist review, a plain-language report and follow-ups that fit your calendar.","cta_label":"Start a program","banner_image":"https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1800&h=800&q=80","banner_value":120,"banner_suffix":"+","banner_caption":"Biomarkers reviewed in a single core screening","grid_title":"Six ways\nto get started.","grid_text":"Each program can be combined or upgraded at any point — your plan grows with you.","why_eyebrow":"Why it works","why_title":"Data you can read.\nPeople you can reach.","why_points":["Results explained in everyday language — no jargon walls.","A named specialist who follows your case from start to finish.","Secure patient portal with every report in one place.","Transparent pricing, agreed before any test is run."],"why_image":"https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1100&h=940&q=80","marquee":["Screen","Understand","Plan","Thrive"],"steps_title":"From first call\nto clear plan.","pricing_title":"Simple, honest\nmembership.","pricing_text":"No surprise invoices. Every plan includes specialist reviews and your patient portal.","faq_title":"Questions,\nanswered."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('specialists_page', '{"title":"Experts who\nmake time.","intro":"Every Curava specialist is board-certified, sees fewer patients per day than the industry average, and is reachable after your visit.","marquee":["Board-certified","Never rushed","Always reachable"],"cta_title":"Not sure who\nto see first?"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('insights_page', '{"title":"Insights &\nfield notes.","intro":"Research explained simply, stories from our patients, and updates from the Curava team.","newsletter_title":"Health notes,\ntwice a month.","newsletter_text":"No spam, no miracle cures — just useful research and reminders, in under five minutes."}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('about_page', '{"title":"Healthcare that\nexplains itself.","intro":"Curava started with a simple frustration: people were getting tested more than ever, yet understanding less. We set out to close that gap.","banner_image":"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1800&h=800&q=80","banner_value":4,"banner_suffix":"","banner_caption":"Clinics, 60+ clinicians and one shared promise","mission_eyebrow":"Our mission","mission_title":"Turn every result into a next step.","mission_text":"We combine modern diagnostics with clinicians who have the time to talk. The goal isn''t more data — it''s clarity: what''s happening in your body, what it means, and what to do about it.","mission_text_2":"That means smaller patient lists, reports written for humans, and a care team you can actually message. It also means saying no to tests you don''t need.","values_title":"What we\nstand for.","values_text":"Three principles guide every hire, every program and every conversation.","timeline_title":"How we got here.","careers_eyebrow":"Careers","careers_title":"Build the clinic you''d want to visit.","careers_points":["Patient lists capped so you can practise properly.","Four-day clinical weeks with protected research time.","Equity for every full-time team member."],"careers_image":"https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1100&h=940&q=80"}'::jsonb) on conflict (key) do nothing;
insert into public.site_content (key, data) values ('contact_page', '{"title":"Contact\nfor health.","intro":"Questions about a program, a result, or just not sure where to start? Our care desk answers every message within one working day.","topics":["Programs & pricing","My results","Billing","Press & partnerships","Something else"],"time_slots":["Morning (7–11am)","Midday (11am–2pm)","Afternoon (2–5pm)","Evening (5–9pm)"],"message_success":"We''ve received your message. A member of the care desk will reply within one working day.","booking_success":"Your appointment request is in. We''ll call you within one working day to confirm the time."}'::jsonb) on conflict (key) do nothing;

-- features
insert into public.features (sort_order, published, title, text, image_url)
select sort_order, published, title, text, image_url from jsonb_populate_recordset(null::public.features, '[{"sort_order":1,"published":true,"title":"Whole-body screening","text":"One visit, 120+ biomarkers reviewed","image_url":"https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&h=900&q=80"},{"sort_order":2,"published":true,"title":"Genomic risk mapping","text":"Know what your DNA is telling you","image_url":"https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&w=900&h=900&q=80"},{"sort_order":3,"published":true,"title":"Personal care plans","text":"Built with you, adjusted as you change","image_url":"https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=900&h=900&q=80"}]'::jsonb)
where not exists (select 1 from public.features);

-- stats
insert into public.stats (sort_order, published, value, prefix, suffix, label, tone)
select sort_order, published, value, prefix, suffix, label, tone from jsonb_populate_recordset(null::public.stats, '[{"sort_order":1,"published":true,"value":38,"prefix":"","suffix":"k+","label":"Patients supported since launch","tone":"default"},{"sort_order":2,"published":true,"value":48,"prefix":"","suffix":"h","label":"Average time to a specialist review","tone":"purple"},{"sort_order":3,"published":true,"value":120,"prefix":"","suffix":"+","label":"Biomarkers in every core panel","tone":"default"},{"sort_order":4,"published":true,"value":4.9,"prefix":"","suffix":"/5","label":"Average patient satisfaction score","tone":"yellow"}]'::jsonb)
where not exists (select 1 from public.stats);

-- doctors
insert into public.doctors (sort_order, published, name, role, years, categories, featured, image_url, bio)
select sort_order, published, name, role, years, categories, featured, image_url, bio from jsonb_populate_recordset(null::public.doctors, '[{"sort_order":1,"published":true,"name":"Dr. Amara Okafor","role":"Cardiology","years":14,"categories":["Heart & vascular"],"featured":true,"image_url":"https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=700&h=770&q=80","bio":"Amara leads our preventive cardiology program and has spent 14 years helping patients understand their heart health before symptoms appear."},{"sort_order":2,"published":true,"name":"Dr. Liam Hartley","role":"Clinical Genetics","years":11,"categories":["Genetics"],"featured":true,"image_url":"https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=700&h=770&q=80","bio":"Liam turns complex genomic reports into practical, personalised plans — and is known for never rushing a consultation."},{"sort_order":3,"published":true,"name":"Dr. Sofia Marín","role":"Dermatology","years":9,"categories":["Skin"],"featured":true,"image_url":"https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=700&h=770&q=80","bio":"Sofia specialises in skin cancer screening and longevity-focused dermatology, combining imaging with clear, kind explanations."},{"sort_order":4,"published":true,"name":"Dr. Marcus Reyes","role":"Endocrinology","years":16,"categories":["Hormones"],"featured":true,"image_url":"https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&h=770&q=80","bio":"Marcus works with patients managing thyroid, diabetes and hormonal conditions, with a focus on sustainable lifestyle change."},{"sort_order":5,"published":true,"name":"Dr. Elena Rossi","role":"Family Medicine","years":12,"categories":["General practice"],"featured":false,"image_url":"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&h=770&q=80","bio":"Elena coordinates care for whole families, making sure nothing falls between the cracks."},{"sort_order":6,"published":true,"name":"Dr. Arjun Mehta","role":"Vascular Medicine","years":8,"categories":["Heart & vascular"],"featured":false,"image_url":"https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&h=770&q=80","bio":"Arjun focuses on circulation and vascular health, from screening to long-term management."},{"sort_order":7,"published":true,"name":"Dr. Noor Haddad","role":"Metabolic Genomics","years":10,"categories":["Genetics","Hormones"],"featured":false,"image_url":"https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=700&h=770&q=80","bio":"Noor researches how genes and metabolism interact, and translates that research into everyday advice."},{"sort_order":8,"published":true,"name":"Dr. Claire Whitman","role":"Preventive Medicine","years":19,"categories":["General practice","Skin"],"featured":false,"image_url":"https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=700&h=770&q=80","bio":"Claire has nearly two decades of experience in preventive care and mentors our clinical team."}]'::jsonb)
where not exists (select 1 from public.doctors);

-- reviews
insert into public.reviews (sort_order, published, name, meta, rating, avatar_url, quote)
select sort_order, published, name, meta, rating, avatar_url, quote from jsonb_populate_recordset(null::public.reviews, '[{"sort_order":1,"published":true,"name":"Hannah Lindqvist","meta":"Product designer, member since 2024","rating":5,"avatar_url":"https://randomuser.me/api/portraits/women/44.jpg","quote":"For years I was told my fatigue was ‘just stress’. Curava''s screening found a thyroid issue in one visit, and my specialist walked me through every number. I finally feel like myself again."},{"sort_order":2,"published":true,"name":"Marcus Bell","meta":"Teacher, member since 2023","rating":5,"avatar_url":"https://randomuser.me/api/portraits/men/32.jpg","quote":"The genomic report sounded intimidating, but the follow-up call made it simple. I left with three concrete changes and a plan I actually stick to."},{"sort_order":3,"published":true,"name":"Priya Raman","meta":"Founder, member since 2025","rating":5,"avatar_url":"https://randomuser.me/api/portraits/women/68.jpg","quote":"Booking took two minutes, results came back in two days, and nobody rushed me. That''s not something I can say about any clinic I''ve visited before."}]'::jsonb)
where not exists (select 1 from public.reviews);

-- programs
insert into public.programs (sort_order, published, title, text, tone)
select sort_order, published, title, text, tone from jsonb_populate_recordset(null::public.programs, '[{"sort_order":1,"published":true,"title":"Whole-body screening","text":"A single morning visit covering heart, metabolic, hormonal and organ health markers.","tone":"default"},{"sort_order":2,"published":true,"title":"Genomic risk mapping","text":"Understand inherited risks and how your lifestyle can shift the odds in your favour.","tone":"purple"},{"sort_order":3,"published":true,"title":"Chronic care partnership","text":"Ongoing support for diabetes, hypertension and thyroid conditions with monthly check-ins.","tone":"default"},{"sort_order":4,"published":true,"title":"Skin & longevity","text":"Dermatology mapping and cellular health markers to keep you ahead of visible change.","tone":"default"},{"sort_order":5,"published":true,"title":"Virtual follow-ups","text":"Video consultations that slot into a lunch break, with notes sent straight to your inbox.","tone":"yellow"},{"sort_order":6,"published":true,"title":"Family health plans","text":"One coordinated plan for the whole household, from kids'' check-ups to parents'' screenings.","tone":"default"}]'::jsonb)
where not exists (select 1 from public.programs);

-- plans
insert into public.plans (sort_order, published, name, price, period, description, features, highlighted, cta_label)
select sort_order, published, name, price, period, description, features, highlighted, cta_label from jsonb_populate_recordset(null::public.plans, '[{"sort_order":1,"published":true,"name":"Essential","price":"$49","period":"/month","description":"For staying on top of the basics.","features":["Annual core screening","Specialist results review","Patient portal access","Email support"],"highlighted":false,"cta_label":"Choose Essential"},{"sort_order":2,"published":true,"name":"Complete","price":"$129","period":"/month","description":"Our most popular, all-round plan.","features":["Twice-yearly screening","Genomic risk mapping","Unlimited virtual follow-ups","Named specialist","Priority booking"],"highlighted":true,"cta_label":"Choose Complete"},{"sort_order":3,"published":true,"name":"Family","price":"$299","period":"/month","description":"One plan for up to five people.","features":["Everything in Complete","Up to 5 members","Family health coordinator","Kids'' check-ups included"],"highlighted":false,"cta_label":"Choose Family"}]'::jsonb)
where not exists (select 1 from public.plans);

-- steps
insert into public.steps (sort_order, published, title, text)
select sort_order, published, title, text from jsonb_populate_recordset(null::public.steps, '[{"sort_order":1,"published":true,"title":"Book a visit","text":"Choose a time online or call the care desk. Takes about two minutes."},{"sort_order":2,"published":true,"title":"Get screened","text":"A relaxed, 60-minute visit at one of our clinics or a partner lab."},{"sort_order":3,"published":true,"title":"Review together","text":"Your specialist walks you through the results within 48 hours."},{"sort_order":4,"published":true,"title":"Follow your plan","text":"Check-ins, reminders and re-tests keep you on track over time."}]'::jsonb)
where not exists (select 1 from public.steps);

-- faqs
insert into public.faqs (sort_order, published, question, answer)
select sort_order, published, question, answer from jsonb_populate_recordset(null::public.faqs, '[{"sort_order":1,"published":true,"question":"Do I need a referral to join a program?","answer":"No. You can book directly. If you already have a GP, we''ll happily share your results with them once you give consent."},{"sort_order":2,"published":true,"question":"How long until I get my results?","answer":"Most results arrive within 48 hours. Genomic reports take 3–4 weeks, and we''ll keep you updated along the way."},{"sort_order":3,"published":true,"question":"Is my health data kept private?","answer":"Yes. Your data is encrypted, never sold, and only visible to you and the clinicians directly involved in your care."},{"sort_order":4,"published":true,"question":"Can I switch programs later?","answer":"Absolutely. Upgrades are credited against what you''ve already paid, and you can pause a membership at any time."}]'::jsonb)
where not exists (select 1 from public.faqs);

-- articles
insert into public.articles (sort_order, published, slug, title, category, read_minutes, featured, excerpt, image_url, author, published_at, body)
select sort_order, published, slug, title, category, read_minutes, featured, excerpt, image_url, author, published_at, body from jsonb_populate_recordset(null::public.articles, '[{"sort_order":1,"published":true,"slug":"what-38000-screenings-taught-us","title":"What 38,000 screenings taught us about catching problems early","category":"Research","read_minutes":8,"featured":true,"excerpt":"Our clinical team shares the patterns hiding in routine bloodwork — and the three markers most people never get checked.","image_url":"https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=1400&h=900&q=80","author":"Dr. Liam Hartley","published_at":"2026-09-18","body":"Since opening our first clinic, we''ve reviewed more than 38,000 screenings. Looking back across that data, a few patterns stand out.\n\n## The markers most people miss\nStandard check-ups usually cover cholesterol and blood sugar. But three markers — ApoB, HbA1c trends and thyroid antibodies — often reveal risk years earlier.\n\n## Trends beat snapshots\nA single result is a photo. Several results over time are a film. The biggest wins came from patients who re-tested every six to twelve months.\n\n## What you can do\nAsk for your numbers, keep copies, and look at the direction of travel. If something is drifting, it''s far easier to steer early."},{"sort_order":2,"published":true,"slug":"genes-load-the-dice","title":"Your genes load the dice — your habits still roll them","category":"Research","read_minutes":6,"featured":false,"excerpt":"Why a genetic risk score is a starting point, not a verdict.","image_url":"https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&h=620&q=80","author":"Dr. Noor Haddad","published_at":"2026-08-30","body":"A genetic risk score tells you about probability, not destiny.\n\n## Risk is a range\nEven a high-risk result usually means a modest change in absolute risk — and lifestyle can move it substantially.\n\n## Use it as a map\nThe most useful thing a genomic report does is tell you where to look first."},{"sort_order":3,"published":true,"slug":"hannahs-thyroid-journey","title":"“I thought I was just tired.” Hannah''s thyroid journey","category":"Patient stories","read_minutes":4,"featured":false,"excerpt":"How one screening ended three years of guesswork.","image_url":"https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=900&h=620&q=80","author":"Curava Editorial","published_at":"2026-08-12","body":"For three years Hannah was told her exhaustion was stress.\n\n## One visit\nHer first Curava screening flagged thyroid antibodies. Two weeks later she had a diagnosis and a plan.\n\n## Today\n\"I didn''t realise how bad I felt until I felt better,\" she says."},{"sort_order":4,"published":true,"slug":"fourth-clinic-evening-hours","title":"Curava opens its fourth clinic, with evening hours","category":"News","read_minutes":2,"featured":false,"excerpt":"Screenings now available until 9pm on weekdays.","image_url":"https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&h=620&q=80","author":"Curava Team","published_at":"2026-07-28","body":"Our newest clinic opens this month, and with it, evening screenings across all locations.\n\nBook online or call the care desk to choose a slot that fits around work."},{"sort_order":5,"published":true,"slug":"insulin-resistance-under-40","title":"The quiet rise of insulin resistance in people under 40","category":"Research","read_minutes":7,"featured":false,"excerpt":"What the numbers show, and the simple test that spots it.","image_url":"https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&h=620&q=80","author":"Dr. Marcus Reyes","published_at":"2026-07-02","body":"Insulin resistance often develops silently for years.\n\n## The test\nA fasting insulin test alongside glucose gives a far clearer picture than glucose alone.\n\n## The good news\nIt''s highly responsive to sleep, movement and diet changes."},{"sort_order":6,"published":true,"slug":"new-patient-portal","title":"New patient portal: every result, one tap away","category":"News","read_minutes":3,"featured":false,"excerpt":"Track trends, message your specialist and rebook in seconds.","image_url":"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&h=620&q=80","author":"Curava Team","published_at":"2026-06-15","body":"The new Curava portal puts every report, trend chart and message in one place.\n\nIt''s available now on web, iOS and Android."}]'::jsonb)
where not exists (select 1 from public.articles);

-- company_values
insert into public.company_values (sort_order, published, title, text, tone)
select sort_order, published, title, text, tone from jsonb_populate_recordset(null::public.company_values, '[{"sort_order":1,"published":true,"title":"Clarity over volume","text":"Fewer, better tests — each one chosen for a reason we can explain to you.","tone":"default"},{"sort_order":2,"published":true,"title":"Time is care","text":"Longer appointments and follow-ups that don''t feel like a favour.","tone":"purple"},{"sort_order":3,"published":true,"title":"Your data, your call","text":"Encrypted, never sold, and shared only when you say so.","tone":"yellow"}]'::jsonb)
where not exists (select 1 from public.company_values);

-- milestones
insert into public.milestones (sort_order, published, year, title, text)
select sort_order, published, year, title, text from jsonb_populate_recordset(null::public.milestones, '[{"sort_order":1,"published":true,"year":"2019","title":"A kitchen-table idea","text":"Two physicians and a data scientist sketch a clinic where results come with explanations."},{"sort_order":2,"published":true,"year":"2021","title":"First clinic opens","text":"Our flagship location welcomes its first 1,000 patients in under six months."},{"sort_order":3,"published":true,"year":"2023","title":"Genomics program launches","text":"Risk mapping becomes available, paired with specialist-led counselling sessions."},{"sort_order":4,"published":true,"year":"2026","title":"Four clinics & a new portal","text":"Evening hours, virtual follow-ups and every result in one place."}]'::jsonb)
where not exists (select 1 from public.milestones);

-- partners
insert into public.partners (sort_order, published, name, logo_url)
select sort_order, published, name, logo_url from jsonb_populate_recordset(null::public.partners, '[{"sort_order":1,"published":true,"name":"Helix Labs","logo_url":""},{"sort_order":2,"published":true,"name":"NorthCare","logo_url":""},{"sort_order":3,"published":true,"name":"Medisure","logo_url":""},{"sort_order":4,"published":true,"name":"Genova","logo_url":""},{"sort_order":5,"published":true,"name":"Pulse+","logo_url":""},{"sort_order":6,"published":true,"name":"Vitalink","logo_url":""}]'::jsonb)
where not exists (select 1 from public.partners);
