"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { createClient } from "@/utils/supabase/client";
import { TOMO } from "@/lib/constants";

const OTP_LENGTH = 6;

type Mode = "login" | "signup";
type Step = "form" | "otp" | "success";

// ── Googly eye that tracks the cursor ──────────────────────────────────────
function GooglyEye() {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx);
      const maxTravel = 7;
      const scale = Math.min(Math.hypot(dx, dy) / 120, 1);
      setPupil({
        x: Math.cos(angle) * maxTravel * scale,
        y: Math.sin(angle) * maxTravel * scale,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={eyeRef}
      className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: "white",
        boxShadow: "0 0 0 2px rgba(255,255,255,0.35), inset 0 1px 2px rgba(0,0,0,0.08)",
      }}
    >
      {/* Iris */}
      <div
        className="absolute rounded-full"
        style={{
          width: 22,
          height: 22,
          background: "#000000",
          transform: `translate(${pupil.x * 0.6}px, ${pupil.y * 0.6}px)`,
        }}
      />
      {/* Pupil */}
      <div
        className="absolute rounded-full"
        style={{
          width: 14,
          height: 14,
          background: "#111",
          transform: `translate(${pupil.x}px, ${pupil.y}px)`,
          transition: "transform 0.04s ease-out",
        }}
      />
    </div>
  );
}

// ── Realistic Code 128-style barcode ───────────────────────────────────────
function RealisticBarcode({ studentId }: { studentId: string }) {
  const unit = 2; // px per module

  // LCG seeded from the student ID for deterministic output
  const seedNum = parseInt(studentId.replace(/\D/g, ""), 10) || 123456789;
  let s = seedNum >>> 0;
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };

  type Bar = { w: number; black: boolean };
  const bars: Bar[] = [];

  const push = (w: number, black: boolean) =>
    bars.push({ w: w * unit, black });

  // Left quiet zone (4 units — outer container provides additional margin)
  push(4, false);

  // Code 128 Start B: ║ │ │ ████ │ ██ (2,1,1,4,1,2)
  [2, 1, 1, 4, 1, 2].forEach((u, i) => push(u, i % 2 === 0));

  // Data: encode each digit of the student ID using Code 128 B digit patterns
  // Code 128 B patterns for '0'–'9' (bar/space widths, 6 elements each, sum=11)
  const digitPatterns: number[][] = [
    [3, 1, 1, 1, 3, 2], // 0 — value 16
    [1, 1, 4, 3, 1, 1], // 1 — value 17
    [1, 1, 1, 4, 3, 1], // 2 — value 18
    [1, 1, 1, 3, 4, 1], // 3 — value 19
    [1, 1, 1, 1, 4, 3], // 4 — value 20 
    [1, 3, 1, 1, 4, 1], // 5 — value 21
    [1, 4, 1, 1, 3, 1], // 6 — value 22
    [1, 4, 1, 1, 1, 3], // 7 — value 23
    [1, 3, 1, 4, 1, 1], // 8 — value 24
    [4, 1, 1, 1, 1, 3], // 9 — value 25
  ];

  // Pad with 2 filler characters on each side for realism
  const fillerPre: number[][] = [];
  const fillerPost: number[][] = [];
  for (let i = 0; i < 2; i++) {
    const r1 = next();
    fillerPre.push(digitPatterns[Math.floor(r1 * 10)]);
    const r2 = next();
    fillerPost.push(digitPatterns[Math.floor(r2 * 10)]);
  }

  // Check character (seeded random pattern, visually plausible)
  const checkPattern = digitPatterns[Math.floor(next() * 10)];

  const allPatterns = [
    ...fillerPre,
    ...studentId.replace(/\D/g, "").split("").map((d) => digitPatterns[+d]),
    ...fillerPost,
    checkPattern,
  ];

  allPatterns.forEach((pattern) => {
    pattern.forEach((u, i) => push(u, i % 2 === 0));
  });

  // Code 128 Stop: ██ ███ ███ │ │ │ ██ + final bar (2,3,3,1,1,1,2 + 2)
  [2, 3, 3, 1, 1, 1, 2].forEach((u, i) => push(u, i % 2 === 0));
  push(2, true);

  // Right quiet zone
  push(4, false);

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      <div className="flex items-stretch w-full overflow-hidden" style={{ height: 36 }}>
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              width: b.w,
              flexShrink: 0,
              backgroundColor: b.black ? "#222" : "transparent",
            }}
          />
        ))}
      </div>
      <p className="text-[7px] font-mono tracking-[0.25em] mt-1.5 text-gray-400">
        {studentId}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: Mode;
  onSuccess?: () => void;
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultMode = "signup",
  onSuccess,
}: AuthDialogProps) {
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [step, setStep] = useState<Step>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Stable random 9-digit ID for this dialog instance
  const [studentId] = useState<string>(() => {
    const n = Math.floor(100000000 + Math.random() * 900000000);
    const s = String(n);
    return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6, 9)}`;
  });

  const reset = () => {
    setStep("form");
    setFirstName("");
    setLastName("");
    setEmail("");

    setOtp("");
    setError(null);
    setIsLoading(false);
  };

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const handleSendOtp = async () => {
    if (mode === "signup" && !firstName.trim()) {
      setError("What's your first name?");
      return;
    }
    if (mode === "signup" && !lastName.trim()) {
      setError("What's your last name?");
      return;
    }
    if (!email) {
      setError("Enter your email to continue.");
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
      setError(`Enter the ${OTP_LENGTH}-digit code.`);
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
      setError("Couldn't finish signing you in. Try again.");
      return;
    }
    if (mode === "signup" && (firstName || lastName)) {
      await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            first_name: firstName || null,
            last_name: lastName || null,
          } as never,
          { onConflict: "id" }
        );
    }
    setIsLoading(false);
    setStep("success");
    onSuccess?.();
  };

  const displayName =
    firstName
      ? [firstName, lastName].filter(Boolean).join(" ")
      : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="p-0 overflow-hidden border-0 shadow-2xl rounded-3xl"
        style={{ maxWidth: 380 }}
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Two Cents Club — Student ID</DialogTitle>

        {/* ── Card ─────────────────────────────────────────────── */}
        <div className="relative bg-white rounded-3xl overflow-hidden">

          {/* ── Header ───────────────────────────────────────── */}
          <div
            className="px-5 pt-5 pb-4 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #C94256 0%, #a33045 100%)" }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-white text-[22px] font-bold mt-0.5 leading-[1.2] tracking-[0.04em]" style={TOMO}>
                  Two Cents Club
                </p>
              </div>
              <GooglyEye />
            </div>

            <div className="flex gap-4 mt-4 items-end">
              <div className="flex-1 pb-1 space-y-1.5">
                <div>
                  <p className="text-[7px] text-white/45 uppercase tracking-widest font-medium">Student Name</p>
                  <p className="text-white font-semibold text-sm leading-tight">
                    {displayName ?? (mode === "login" ? "— —" : "New Student")}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[7px] text-white/45 uppercase tracking-widest font-medium">Student ID</p>
                    <p className="text-white/75 text-[10px]">{studentId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ── Body ─────────────────────────────────────────── */}
          <div className="px-5 pt-4 pb-5">

            {/* Mode tabs — form step only */}
            {step === "form" && (
              <div className="flex rounded-xl bg-gray-100 p-1 mb-4">
                <button
                  onClick={() => handleModeSwitch("signup")}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
                    mode === "signup"
                      ? "bg-white shadow text-black"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  New Student
                </button>
                <button
                  onClick={() => handleModeSwitch("login")}
                  className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
                    mode === "login"
                      ? "bg-white shadow text-black"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Returning Student
                </button>
              </div>
            )}

            {/* ── Form ──────────────────────────────────────── */}
            {step === "form" && (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSendOtp();
                }}
              >
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-medium tracking-[0.04em] text-gray-400 uppercase block mb-1">
                        First Name
                      </label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First"
                        autoComplete="given-name"
                        className="h-9 text-sm bg-amber-50/60 border-amber-100 focus-visible:ring-[#C94256]/30 placeholder:text-gray-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-medium tracking-[0.04em] text-gray-400 uppercase block mb-1">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last"
                        autoComplete="family-name"
                        className="h-9 text-sm bg-amber-50/60 border-amber-100 focus-visible:ring-[#C94256]/30 placeholder:text-gray-300"
                        required
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-[9px] font-medium tracking-[0.04em] text-gray-400 uppercase block mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      mode === "login" ? "your@email.com" : "email@twocents.club"
                    }
                    autoComplete="email"
                    className="h-9 text-sm bg-amber-50/60 border-amber-100 focus-visible:ring-[#C94256]/30 placeholder:text-gray-300"
                    required
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-600" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-[#C94256] text-white text-sm font-medium transition-colors hover:bg-[#a33045] disabled:opacity-60 disabled:bg-gray-400 mt-1"
                >
                  {isLoading ? "Sending link..." : "Enroll"}
                </button>

                {mode === "signup" ? (
                  <p className="text-center text-[10px] text-gray-400">
                    Already enrolled?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("login")}
                      className="text-[#C94256] font-medium hover:underline"
                    >
                      Log in here
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-[10px] text-gray-400">
                    First time?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("signup")}
                      className="text-[#C94256] font-medium hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                )}
              </form>
            )}

            {/* ── OTP ───────────────────────────────────────── */}
            {step === "otp" && (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleVerifyOtp();
                }}
              >
                <div className="text-center space-y-1 mb-2">
                  <p className="text-[9px] font-medium tracking-[0.2em] text-gray-400 uppercase">
                    Verification Code
                  </p>
                  <p className="text-xs text-gray-500">
                    We sent a {OTP_LENGTH}-digit code to{" "}
                    <span className="font-semibold text-gray-700">{email}</span>
                  </p>
                </div>
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-[#C94256] text-white text-sm font-medium transition-colors hover:bg-[#a33045] disabled:opacity-60 disabled:bg-gray-400"
                >
                  {isLoading ? "Verifying..." : "Unlock Access"}
                </button>
                <button
                  type="button"
                  className="w-full text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setStep("form")}
                >
                  ← Try a different email
                </button>
              </form>
            )}

            {/* ── Success ───────────────────────────────────── */}
            {step === "success" && (
              <div className="text-center py-2 space-y-4">
                <div className="text-5xl">🎓</div>
                <div>
                  <p className="font-medium text-xl">Enrollment Confirmed!</p>
                </div>
                <button
                  onClick={() => handleOpenChange(false)}
                  className="w-full py-3 rounded-full text-black text-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ background: "#F6DE27" }}
                >
                  Explore Classes
                </button>
              </div>
            )}
          </div>

          {/* ── Barcode footer ────────────────────────────────── */}
          <div className="px-5 pt-5 pb-4 border-t border-gray-100">
            <RealisticBarcode studentId={studentId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
