import { getOrCreateUser } from "@/lib/getUser";
import { supabaseAdmin } from "@/lib/supabase";
import { WardrobeClient } from "@/components/WardrobeClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const userId = await getOrCreateUser();

  const { data: items } = await supabaseAdmin
    .from("wardrobe_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 w-full flex flex-col p-6 md:p-12 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto w-full">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[10px] text-p uppercase tracking-[0.4em] mb-2 font-bold">THE WARDROBE</div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tighter text-tx">Your Closet</h1>
              <span className="bg-p/10 border border-p/30 text-p text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                {(items || []).length} pieces
              </span>
            </div>
            <p className="text-tx-muted uppercase tracking-widest text-xs font-bold mt-4">Everything you own, ready to be styled.</p>
          </div>
        </header>
        
        <WardrobeClient initialItems={items || []} />
      </div>
    </main>
  );
}
