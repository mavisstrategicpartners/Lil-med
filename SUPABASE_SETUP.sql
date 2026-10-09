-- LilMed Supabase schema. Run this once in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sap text,
  name text not null,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  raw_category text,
  inner_moq text,
  price numeric not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_name text,
  customer_email text,
  customer_phone text,
  company text,
  notes text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text not null default 'new',  -- new | contacted | closed
  emailed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  role text not null default 'admin',   -- admin | lead_admin
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_email text not null,
  action text not null,
  target text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.quotes      enable row level security;
alter table public.admins      enable row level security;
alter table public.audit_logs  enable row level security;

-- Public read for products & categories (catalog is public)
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (true);

-- Anyone can submit a quote
drop policy if exists "anyone can insert quotes" on public.quotes;
create policy "anyone can insert quotes" on public.quotes for insert with check (true);

-- Authenticated admins can read/manage everything
drop policy if exists "admins read quotes" on public.quotes;
create policy "admins read quotes" on public.quotes
  for select using (auth.role() = 'authenticated');

drop policy if exists "admins update quotes" on public.quotes;
create policy "admins update quotes" on public.quotes
  for update using (auth.role() = 'authenticated');

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories" on public.categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins
  for select using (auth.role() = 'authenticated');

drop policy if exists "admins insert audit" on public.audit_logs;
create policy "admins insert audit" on public.audit_logs
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "admins read audit" on public.audit_logs;
create policy "admins read audit" on public.audit_logs
  for select using (auth.role() = 'authenticated');

-- Product image storage bucket (public)
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "authenticated write product images" on storage.objects;
create policy "authenticated write product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "authenticated update product images" on storage.objects;
create policy "authenticated update product images" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- First admin: after creating the Supabase Auth user, run:
-- insert into public.admins (email, name, role) values ('you@example.com', 'You', 'lead_admin');
