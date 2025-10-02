import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/app-navbar";
import { createClient } from "@/utils/supabase/server";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  if (!user.user_metadata?.onboarded) {
    redirect("/onboarding");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .maybeSingle();

  const profileFirstName =
    typeof (profile as { first_name: string | null } | null)?.first_name === "string" && profile && (profile as { first_name: string | null }).first_name && (profile as { first_name: string }).first_name.trim().length > 0
      ? (profile as { first_name: string }).first_name.trim()
      : undefined;
  const metadataFirstName =
    typeof user.user_metadata?.first_name === "string" && user.user_metadata.first_name.trim().length > 0
      ? user.user_metadata.first_name.trim()
      : undefined;
  const derivedFirstName =
    profileFirstName ?? metadataFirstName ?? user.email?.split("@")[0] ?? "Friend";

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar firstName={derivedFirstName} />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
