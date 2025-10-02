"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No user found. Please sign in again.");
        return;
      }

      // Update user metadata to mark as onboarded
      const { error: updateError } = await supabase.auth.updateUser({
        data: { onboarded: true },
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Redirect to home
      router.push("/home");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex w-full max-w-md flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-4xl">Welcome to Two Cents Club!</h1>
        <p className="text-lg">
          Let&apos;s get you set up. This is where your onboarding flow will
          go.
        </p>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <Button onClick={handleCompleteOnboarding} disabled={isLoading}>
          {isLoading ? "Setting up..." : "Get Started"}
        </Button>
      </main>
    </div>
  );
}
