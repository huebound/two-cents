import { createClient } from "@/utils/supabase/server";
import ProfileForm from "./profile-form";
import LogoutButton from "./logout-button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("first_name, last_name, username, knowledge, want_to_learn")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  type Profile = { first_name: string | null; last_name: string | null; username: string | null; knowledge: string[] | null; want_to_learn: string[] | null };
  const firstName = (profile as Profile | null)?.first_name?.trim() || user.user_metadata?.first_name?.trim() || "";
  const lastName = (profile as Profile | null)?.last_name?.trim() || user.user_metadata?.last_name?.trim() || "";
  const username = (profile as Profile | null)?.username?.trim() || null;
  const knowledgeValues = Array.isArray((profile as Profile | null)?.knowledge) ? (profile as Profile | null)!.knowledge! : [];
  const knowledge = knowledgeValues.filter((value): value is string => typeof value === "string");
  const wantToLearnValues = Array.isArray((profile as Profile | null)?.want_to_learn) ? (profile as Profile | null)!.want_to_learn! : [];
  const wantToLearn = wantToLearnValues.filter((value): value is string => typeof value === "string");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-600">
            Update how other members see you and what you want to teach or learn.
          </p>
        </div>
        <LogoutButton />
      </div>

      <ProfileForm
        firstName={firstName}
        lastName={lastName}
        username={username}
        knowledge={knowledge}
        wantToLearn={wantToLearn}
      />
    </div>
  );
}
