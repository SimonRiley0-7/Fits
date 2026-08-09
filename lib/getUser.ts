import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function getOrCreateUser() {
  const { userId } = await auth();
  const clerkId = userId || "guest_user";

  // Check if user exists in Supabase
  let { data: user, error: fetchError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single();

  if (!user) {
    // Create the user
    const { data: newUser, error: createError } = await supabaseAdmin
      .from("users")
      .insert({
        clerk_id: clerkId,
        email: `${clerkId}@grabbit-mock.com`, // mock email for the guest
        name: clerkId === "guest_user" ? "Guest User" : "Grabbit User"
      })
      .select("id")
      .single();

    if (createError) throw createError;
    return newUser.id;
  }

  return user.id;
}
