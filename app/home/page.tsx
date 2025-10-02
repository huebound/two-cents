import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to landing if not authenticated
  if (!user) {
    redirect("/");
  }

  // Redirect to onboarding if not yet onboarded
  if (!user.user_metadata?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex w-full max-w-2xl flex-col gap-8 px-4">
        <h1 className="text-4xl">Home</h1>
        <p className="text-lg">
          Welcome back, {user.email}! This is your home screen.
        </p>
      </main>
    </div>
  );
}
