"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

const OTP_LENGTH = 6;

type AuthStep = "email" | "otp" | "success";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const supabase = createSupabaseClient();
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setStep("email");
    setEmail("");
    setFirstName("");
    setLastName("");
    setOtp("");
    setError(null);
    setIsLoading(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const handleSendOtp = async () => {
    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!email) {
      setError("Enter an email address to continue.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const { error: sendError } = await supabase.auth.signInWithOtp({ email });
    setIsLoading(false);
    if (sendError) {
      setError(sendError.message);
      return;
    }
    setStep("otp");
    setOtp("");
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code you received.`);
      return;
    }
    setIsLoading(true);
    setError(null);
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (verifyError) {
      setIsLoading(false);
      setError(verifyError.message);
      return;
    }
    if (!data?.session || !data?.user) {
      setIsLoading(false);
      setError("We couldn't finish signing you in. Try again.");
      return;
    }
    if (firstName || lastName) {
      await supabase
        .from("profiles")
        .upsert(
          { id: data.user.id, first_name: firstName || null, last_name: lastName || null } as never,
          { onConflict: "id" }
        );
    }
    setIsLoading(false);
    setStep("success");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-8">
        <DialogTitle className="sr-only">Join Two Cents Club</DialogTitle>

        {step === "email" && (
          <div className="flex flex-col gap-6">
            <div className="space-y-1">
              <h2
                className="text-2xl font-medium leading-tight"
                style={{ fontFamily: "var(--font-neue-montreal)" }}
              >
                Join Two Cents Club
              </h2>
              <p className="text-sm text-gray-500">
                Sign up to attend classes and join the community.
              </p>
            </div>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void handleSendOtp();
              }}
            >
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className="h-10"
                  required
                />
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  className="h-10"
                  required
                />
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className="h-10"
                required
              />
              {error && (
                <p className="text-xs text-red-600" role="alert">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-full bg-black text-white hover:bg-gray-800"
              >
                {isLoading ? "Sending code..." : "Continue"}
              </Button>
            </form>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-6">
            <div className="space-y-1">
              <h2
                className="text-2xl font-medium leading-tight"
                style={{ fontFamily: "var(--font-neue-montreal)" }}
              >
                Check your email
              </h2>
              <p className="text-sm text-gray-500">
                We sent a {OTP_LENGTH}-digit code to{" "}
                <span className="font-medium text-gray-700">{email}</span>.
              </p>
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void handleVerifyOtp();
              }}
            >
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
              {error && (
                <p className="text-xs text-center text-red-600" role="alert">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-full bg-black text-white hover:bg-gray-800"
              >
                {isLoading ? "Verifying..." : "Verify code"}
              </Button>
              <button
                type="button"
                className="w-full text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={() => setStep("email")}
              >
                Use a different email
              </button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-6 text-center py-4">
            <div
              className="w-16 h-16 rounded-full bg-[#F6DE27] flex items-center justify-center text-2xl"
              aria-hidden="true"
            >
              🎉
            </div>
            <div className="space-y-2">
              <h2
                className="text-2xl font-medium"
                style={{ fontFamily: "var(--font-neue-montreal)" }}
              >
                You&apos;re in!
              </h2>
              <p className="text-sm text-gray-500 max-w-[260px]">
                Welcome to Two Cents Club. We&apos;ll be in touch as classes open up.
              </p>
            </div>
            <Button
              onClick={() => handleOpenChange(false)}
              className="rounded-full bg-black text-white hover:bg-gray-800 px-8"
            >
              Explore classes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
