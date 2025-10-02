"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type DeleteClassState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

const INITIAL_STATE: DeleteClassState = { status: "idle" };

export async function deleteClassAction(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: DeleteClassState = INITIAL_STATE,
  formData: FormData,
): Promise<DeleteClassState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "You must be signed in to delete a class." };
  }

  const classId = formData.get("classId")?.toString();

  if (!classId) {
    return { status: "error", message: "Class ID is required." };
  }

  // Verify the user is the host of this class
  const { data: classData, error: fetchError } = await supabase
    .from("classes")
    .select("host_id")
    .eq("id", classId)
    .maybeSingle();

  if (fetchError) {
    return { status: "error", message: fetchError.message };
  }

  if (!classData) {
    return { status: "error", message: "Class not found." };
  }

  if ((classData as { host_id: string | null }).host_id !== user.id) {
    return { status: "error", message: "You can only delete classes you host." };
  }

  // Delete the class
  const { error: deleteError } = await supabase
    .from("classes")
    .delete()
    .eq("id", classId);

  if (deleteError) {
    return { status: "error", message: deleteError.message };
  }

  revalidatePath("/classes");
  revalidatePath("/home");

  redirect("/classes");
}
