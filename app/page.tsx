"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

const OTP_LENGTH = 6;

type Step = "landing" | "email" | "otp" | "success";

export default function Home() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [step, setStep] = useState<Step>("landing");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setStep("success");
        setStatusMessage("You're in. Welcome to Two Cents Club!");
      }
    };
    void checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendOtp = async () => {
    if (!email) {
      setError("Enter an email address to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage(null);

    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
    });

    setIsLoading(false);

    if (sendError) {
      setError(sendError.message);
      return;
    }

    setStep("otp");
    setOtp("");
    setStatusMessage(`We sent a ${OTP_LENGTH}-digit code to ${email}.`);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code you received.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage(null);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    setIsLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    if (!data?.session) {
      setError("We couldn't finish signing you in. Try again.");
      return;
    }

    setStep("success");
    setStatusMessage("You're in. Welcome to Two Cents Club!");
  };

  const handleReset = () => {
    void supabase.auth.signOut();
    setStep("landing");
    setEmail("");
    setOtp("");
    setError(null);
    setStatusMessage(null);
  };

  if (step === "landing") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <main className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl">Welcome to Two Cents Club.</h1>
          <div className="flex gap-4">
            <Button onClick={() => setStep("email")}>Join the Club</Button>
          </div>
        </main>
      </div>
    );
  }

  if (step === "email") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <main className="flex w-full max-w-md flex-col items-center gap-8 px-4">
          <h1 className="text-4xl text-center">Join the Club</h1>
          <form
            className="w-full space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSendOtp();
            }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending code..." : "Send code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <main className="flex w-full max-w-md flex-col items-center gap-8 px-4">
          <h1 className="text-4xl text-center">
            Enter your {OTP_LENGTH}-digit code
          </h1>
          <form
            className="w-full space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              void handleVerifyOtp();
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={setOtp}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} aria-label="Digit 1" />
                  <InputOTPSlot index={1} aria-label="Digit 2" />
                  <InputOTPSlot index={2} aria-label="Digit 3" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} aria-label="Digit 4" />
                  <InputOTPSlot index={4} aria-label="Digit 5" />
                  <InputOTPSlot index={5} aria-label="Digit 6" />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-muted-foreground">
                Code sent to {email}
              </p>
            </div>

            {statusMessage ? (
              <p className="text-sm text-foreground" role="status">
                {statusMessage}
              </p>
            ) : null}

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("email")}
                disabled={isLoading}
              >
                Edit email
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex w-full max-w-md flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-4xl">All set!</h1>
        {statusMessage ? <p className="text-lg">{statusMessage}</p> : null}
        <Button type="button" onClick={handleReset} variant="outline">
          Sign out
        </Button>
      </main>
    </div>
  );
}
