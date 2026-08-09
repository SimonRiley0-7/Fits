// One-time migration script to create the wishlist table
// Run with: npx tsx scripts/migrate-wishlist.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrate() {
  console.log("Creating wishlist table...");
  
  const sql = `
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
  `;

  const { error } = await (async () => {
    try {
      return await supabase.rpc("exec_sql", { query: sql });
    } catch (e) {
      return { error: null };
    }
  })();
  
  // Try direct insert approach to test if table exists
  const { error: testError } = await supabase.from("wishlist").select("id").limit(1);
  
  if (!testError) {
    console.log("✅ Wishlist table already exists and is accessible!");
  } else {
    console.log("Table doesn't exist yet. Please run this SQL in your Supabase SQL Editor:");
    console.log(sql);
  }
}

migrate().catch(console.error);
