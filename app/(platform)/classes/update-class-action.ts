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

  const scheduleSummary = formData.get("scheduleSummary")?.toString().trim() ?? "";
  const meetingDays = formData.get("meetingDays")?.toString().trim() ?? "";
  const locationDetails = formData.get("locationDetails")?.toString().trim() ?? "";
  const requirementsRaw = formData.get("requirements")?.toString().trim() ?? "";
  const hostBlurb = formData.get("hostBlurb")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  if (!scheduleSummary || !meetingDays || !locationDetails || !description) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  const { data, error } = await supabase
    .from("classes")
    .update({
      schedule_summary: scheduleSummary,
      meeting_days: meetingDays,
      location_details: locationDetails,
      requirements: requirementsRaw.length > 0 ? requirementsRaw : null,
      host_blurb: hostBlurb.length > 0 ? hostBlurb : null,
      description,
    })
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
