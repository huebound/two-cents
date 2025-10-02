"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type TeachFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; classId: string };

const INITIAL_STATE: TeachFormState = { status: "idle" };

export async function createClassAction(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: TeachFormState = INITIAL_STATE,
  formData: FormData,
): Promise<TeachFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Please sign in to create a class." };
  }

  const title = formData.get("title")?.toString().trim() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() ?? "";
  const weeks = Number(formData.get("weeks"));
  const totalSpots = Number(formData.get("totalSpots"));
  const level = formData.get("level")?.toString() ?? "";
  const startDate = formData.get("startDate")?.toString() ?? "";
  const endDate = formData.get("endDate")?.toString() ?? "";
  const startTime = formData.get("startTime")?.toString() ?? "";
  const endTime = formData.get("endTime")?.toString() ?? "";
  const normalizedStartTime = startTime.length === 5 ? `${startTime}:00` : startTime;
  const normalizedEndTime = endTime.length === 5 ? `${endTime}:00` : endTime;
  const meetingDays = formData.get("meetingDays")?.toString().trim() ?? "";
  const scheduleSummary = formData.get("scheduleSummary")?.toString().trim() ?? "";
  const locationTag = formData.get("locationTag")?.toString() ?? "";
  const locationDetails = formData.get("locationDetails")?.toString().trim() ?? "";
  const requirementsRaw = formData.get("requirements")?.toString().trim() ?? "";
  const hostBlurb = formData.get("hostBlurb")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  if (!title) {
    return { status: "error", message: "Title is required." };
  }

  if (!Number.isFinite(weeks) || weeks <= 0) {
    return { status: "error", message: "Weeks must be a positive number." };
  }

  if (!Number.isFinite(totalSpots) || totalSpots <= 0) {
    return { status: "error", message: "Total spots must be a positive number." };
  }

  if (!["Beginner", "Intermediate", "Advanced"].includes(level)) {
    return { status: "error", message: "Select a valid level." };
  }

  if (!startDate || !endDate) {
    return { status: "error", message: "Start and end dates are required." };
  }

  if (endDate < startDate) {
    return { status: "error", message: "End date must be on or after the start date." };
  }

  if (!startTime || !endTime) {
    return { status: "error", message: "Start and end times are required." };
  }

  if (endTime <= startTime) {
    return { status: "error", message: "End time must be after start time." };
  }

  if (!meetingDays) {
    return { status: "error", message: "Meeting days are required." };
  }

  if (!scheduleSummary) {
    return { status: "error", message: "Provide a schedule summary." };
  }

  if (locationTag !== "DTLA") {
    return { status: "error", message: "Location tag must be DTLA." };
  }

  if (!locationDetails) {
    return { status: "error", message: "Location details are required." };
  }

  if (!hostBlurb) {
    return { status: "error", message: "Please add a host introduction." };
  }

  if (!description) {
    return { status: "error", message: "Please add a class description." };
  }

  const requirements = requirementsRaw.length > 0 ? requirementsRaw : null;

  const { data, error } = await supabase
    .from("classes")
    .insert({
      host_id: user.id,
      title,
      image_url: imageUrl.length > 0 ? imageUrl : null,
      level,
      weeks,
      total_spots: totalSpots,
      start_date: startDate,
      end_date: endDate,
      start_time: normalizedStartTime,
      end_time: normalizedEndTime,
      meeting_days: meetingDays,
      schedule_summary: scheduleSummary,
      location_tag: locationTag,
      location_details: locationDetails,
      requirements,
      host_blurb: hostBlurb,
      description,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { status: "error", message: error?.message ?? "Could not create class." };
  }

  revalidatePath("/home");
  revalidatePath(`/classes/${data.id}`);

  return { status: "success", classId: data.id };
}
