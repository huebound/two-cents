"use server";

import { revalidatePath } from "next/cache";
import { getClassById } from "@/lib/class-queries";
import { createClient } from "@/utils/supabase/server";

export type RegisterActionResult =
  | { success: true }
  | { success: false; error: string };

export async function registerForClassAction(
  classId: string,
): Promise<RegisterActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please sign in to register." };
  }

  const classData = await getClassById(supabase, classId, user.id);

  if (!classData) {
    return { success: false, error: "Class not found." };
  }

  if (classData.isRegistered) {
    return { success: false, error: "You are already registered for this class." };
  }

  if (classData.spotsLeft <= 0) {
    return { success: false, error: "This class is already full." };
  }

  const { error } = await supabase
    .from("class_registrations")
    .insert({
      class_id: classId,
      user_id: user.id,
    } as never);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "You are already registered for this class." };
    }

    return { success: false, error: error.message };
  }

  revalidatePath("/home");
  revalidatePath(`/classes/${classId}`);

  return { success: true };
}
