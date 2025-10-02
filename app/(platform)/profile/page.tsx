import { createClient } from "@/utils/supabase/server";
import ProfileForm from "./profile-form";

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
    .select("first_name, last_name, username, knowledge, want_to_learn_role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const firstName = profile?.first_name?.trim() || user.user_metadata?.first_name?.trim() || "";
  const lastName = profile?.last_name?.trim() || user.user_metadata?.last_name?.trim() || "";
  const username = profile?.username?.trim() || null;
  const knowledgeValues = Array.isArray(profile?.knowledge) ? profile.knowledge : [];
  const knowledge = knowledgeValues.filter((value): value is string => typeof value === "string");
  const wantToLearnRole =
    profile && typeof profile.want_to_learn_role === "string" ? profile.want_to_learn_role : null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-600">
          Update how other members see you and what you want to teach or learn.
        </p>
      </div>

      <ProfileForm
        firstName={firstName}
        lastName={lastName}
        username={username}
        knowledge={knowledge}
        wantToLearnRole={wantToLearnRole}
      />
    </div>
  );
}
