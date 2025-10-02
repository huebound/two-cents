"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { LEARN_ROLE_OPTIONS, PROFILE_TOPIC_OPTIONS } from "@/lib/profile-options";

export type ProfileFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

const INITIAL_STATE: ProfileFormState = { status: "idle" };

const TOPIC_SET = new Set(PROFILE_TOPIC_OPTIONS);
const ROLE_SET = new Set(LEARN_ROLE_OPTIONS);

export async function updateProfileAction(
  _prevState: ProfileFormState = INITIAL_STATE,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Please sign in to update your profile." };
  }

  const firstNameRaw = formData.get("firstName")?.toString() ?? "";
  const lastNameRaw = formData.get("lastName")?.toString() ?? "";
  const usernameRaw = formData.get("username")?.toString() ?? "";
  const knowledgeSelected = formData.getAll("knowledge").map((value) => value.toString());
  const wantRoleRaw = formData.get("wantToLearnRole")?.toString() ?? "";

  const firstName = firstNameRaw.trim();
  const lastName = lastNameRaw.trim();
  const username = usernameRaw.trim() || null;
  const wantRole = wantRoleRaw.trim() ? wantRoleRaw.trim() : null;

  if (!firstName || !lastName) {
    return { status: "error", message: "Name cannot be empty." };
  }

  const filteredKnowledge = Array.from(
    new Set(knowledgeSelected.filter((topic) => TOPIC_SET.has(topic as never))),
  );

  if (wantRole && !ROLE_SET.has(wantRole as never)) {
    return { status: "error", message: "Select a valid learning role." };
  }

  const { data: updateResult, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        username,
        knowledge: filteredKnowledge,
        want_to_learn_role: wantRole,
      } as never,
      { onConflict: "id" },
    )
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "That username is already taken." };
    }

    return { status: "error", message: error.message };
  }

  if (!updateResult) {
    return { status: "error", message: "Unable to save your profile." };
  }

  await supabase.auth.updateUser({
    data: { first_name: firstName, last_name: lastName },
  });

  revalidatePath("/home");
  revalidatePath("/classes");
  revalidatePath("/profile");

  return { status: "success" };
}
