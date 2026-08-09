-- Phase 0: Drobe Database Schema

create table users (
  id uuid default gen_random_uuid() primary key,
  clerk_id text unique,
  email text unique not null,
  name text,
  role text default 'user',
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table wardrobe_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  image_url text not null,
  category text, -- e.g., 'shirt', 'pants', 'shoes'
  color text,
  style text,
  brand text,
  is_manual boolean default false,
  created_at timestamptz default now()
);

create table purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  wardrobe_item_id uuid references wardrobe_items(id),
  retailer text,
  price numeric,
  status text default 'completed',
  created_at timestamptz default now()
);

create table outfits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  occasion text not null,
  item_ids uuid[] not null, -- array of wardrobe_items IDs
  missing_category text, -- if Iris flagged a missing item
  created_at timestamptz default now()
);

-- Enable RLS
alter table users enable row level security;
alter table wardrobe_items enable row level security;
alter table purchases enable row level security;
alter table outfits enable row level security;

create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  product_id text not null,
  title text,
  price numeric,
  image_url text,
  link text,
  retailer text,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table wishlist enable row level security;
