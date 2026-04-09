import type { User } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";

type Supabase = Awaited<ReturnType<typeof createServerClient>>;

/** Resolves a user's first name from the profiles table, falling back to user_metadata. */
export async function getUserFirstName(
  supabase: Supabase,
  user: User,
): Promise<string | undefined> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .maybeSingle();

  const name =
    (profile as { first_name: string | null } | null)?.first_name?.trim() ||
    user.user_metadata?.first_name?.trim() ||
    undefined;

  return name || undefined;
}
