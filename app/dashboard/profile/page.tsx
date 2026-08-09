import { getOrCreateUser } from "@/lib/getUser";
import { supabaseAdmin } from "@/lib/supabase";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const userId = await getOrCreateUser();

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("metadata")
    .eq("id", userId)
    .single();

  const metadata = user?.metadata || {};
  const styleDna = metadata.style_dna || {
    gender: "Men",
    topSize: "L",
    bottomSize: "32",
    fitPreference: "Regular",
    vibe: "Minimalist"
  };

  return (
    <main className="flex-1 w-full flex flex-col p-6 md:p-12">
      <div className="max-w-2xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="t-h1 mb-2">Style DNA</h1>
          <p className="t-body">Set your global style preferences. Iris will use these to curate your outfits.</p>
        </header>
        <ProfileForm initialData={styleDna} />
      </div>
    </main>
  );
}
