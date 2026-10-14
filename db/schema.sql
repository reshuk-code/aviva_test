-- Aviva CMS schema. Safe to run more than once: `npm run db:setup`.

create table if not exists admins (
  id serial primary key,
  email text not null unique,
  name text not null default '',
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id serial primary key,
  slug text not null unique,
  title text not null,
  category text not null default '',
  description text not null default '',
  body text not null default '',
  image text not null default '',
  client text not null default '',
  year text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists posts (
  id serial primary key,
  slug text not null unique,
  title text not null,
  category text not null default '',
  excerpt text not null default '',
  body text not null default '',
  image text not null default '',
  published boolean not null default false,
  published_at date not null default current_date,
  updated_at timestamptz not null default now()
);

create table if not exists team_members (
  id serial primary key,
  name text not null,
  role text not null default '',
  bio text not null default '',
  image text not null default '',
  published boolean not null default false,
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists inquiries (
  id serial primary key,
  kind text not null default 'Contact message',
  name text not null,
  email text not null default '',
  phone text not null default '',
  subject text not null default '',
  services text not null default '',
  budget text not null default '',
  timeline text not null default '',
  message text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id serial primary key,
  slug text not null unique,
  title text not null,
  summary text not null default '',
  intro_heading text not null default '',
  intro text not null default '',
  body_heading text not null default '',
  body text not null default '',
  highlights text not null default '',
  image text not null default '',
  gallery text not null default '',
  faqs jsonb not null default '[]',
  published boolean not null default false,
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value text not null default ''
);

create index if not exists posts_listing on posts (published, published_at desc);
create index if not exists projects_listing on projects (published, position);
create index if not exists services_listing on services (published, position);
create index if not exists inquiries_recent on inquiries (created_at desc);

-- SEO and image alt text on every content type.
alter table projects add column if not exists image_alt text not null default '';
alter table projects add column if not exists seo_title text not null default '';
alter table projects add column if not exists seo_description text not null default '';
alter table projects add column if not exists og_image text not null default '';
alter table projects add column if not exists noindex boolean not null default false;
alter table posts add column if not exists image_alt text not null default '';
alter table posts add column if not exists seo_title text not null default '';
alter table posts add column if not exists seo_description text not null default '';
alter table posts add column if not exists og_image text not null default '';
alter table posts add column if not exists noindex boolean not null default false;
alter table services add column if not exists image_alt text not null default '';
alter table services add column if not exists seo_title text not null default '';
alter table services add column if not exists seo_description text not null default '';
alter table services add column if not exists og_image text not null default '';
alter table services add column if not exists noindex boolean not null default false;
alter table team_members add column if not exists image_alt text not null default '';

-- Editable content and SEO for fixed pages (home, about, contact…). Missing fields fall back to the defaults in app/lib/pages.ts.
create table if not exists pages (
  key text primary key,
  content jsonb not null default '{}',
  seo_title text not null default '',
  seo_description text not null default '',
  og_image text not null default '',
  noindex boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Media library.
create table if not exists media (
  id serial primary key,
  url text not null unique,
  alt text not null default '',
  width integer not null default 0,
  height integer not null default 0,
  bytes integer not null default 0,
  created_at timestamptz not null default now()
);

-- Old addresses keep working after a slug changes.
create table if not exists redirects (
  from_path text primary key,
  to_path text not null,
  created_at timestamptz not null default now()
);

-- Technologies used (one per line) and a link to the live project.
alter table services add column if not exists tech_stack text not null default '';
alter table projects add column if not exists tech_stack text not null default '';
alter table projects add column if not exists website text not null default '';
