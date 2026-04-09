"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type UpdateClassFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

const INITIAL_STATE: UpdateClassFormState = { status: "idle" };

export async function updateClassDetailsAction(
  _prevState: UpdateClassFormState = INITIAL_STATE,
  formData: FormData,
): Promise<UpdateClassFormState> {
  const classId = formData.get("classId")?.toString();

  if (!classId) {
    return { status: "error", message: "Missing class identifier." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Please sign in to edit your class." };
  }

  const meetingDays = formData.get("meetingDays")?.toString().trim() ?? "";
  const hostBlurb = formData.get("hostBlurb")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  if (!meetingDays || !description) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  const { data, error } = await supabase
    .from("classes")
    .update({
      meeting_days: meetingDays,
      host_blurb: hostBlurb.length > 0 ? hostBlurb : null,
      description,
    } as never)
    .eq("id", classId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { status: "error", message: error.message };
  }

  if (!data) {
    return { status: "error", message: "Unable to update this class." };
  }

  revalidatePath("/classes");
  revalidatePath(`/classes/${classId}`);

  return { status: "success" };
}
