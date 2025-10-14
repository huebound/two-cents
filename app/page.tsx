"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [step, setStep] = useState<Step>("landing");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // hero alignment helpers
  const sectionRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const [rowTop, setRowTop] = useState<number | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Check if user has completed onboarding
        if (user?.user_metadata?.onboarded) {
          router.push("/home");
        } else {
          router.push("/onboarding");
        }
      }
    };
    void checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Penny alignment logic removed; penny uses hero-nudge like other assets

  // Position the baseline row just below the CTA
  useEffect(() => {
    const syncRow = () => {
      const sec = sectionRef.current;
      const cta = ctaRef.current;
      if (!sec || !cta) return;
      const s = sec.getBoundingClientRect();
      const b = cta.getBoundingClientRect();
      const top = b.bottom - s.top + 32; // 32px gap below CTA
      setRowTop(top);
    };
    syncRow();
    window.addEventListener("resize", syncRow);
    try { document?.fonts?.ready?.then?.(() => syncRow()); } catch (_) {}
    return () => window.removeEventListener("resize", syncRow);
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

    // Check if user has completed onboarding
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.user_metadata?.onboarded) {
      router.push("/home");
    } else {
      router.push("/onboarding");
    }
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
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header/Nav Bar */}
        <header className="flex items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-2">
            <img
              src="/images/2C-Landing-Assets/eyeball.png"
              alt="Two Cents Club"
              className="h-6 w-6"
            />
            <span className="text-base font-medium">Two Cents Club</span>
          </div>
          <button
            className="text-base font-medium hover:underline"
            onClick={() => setStep("email")}
          >
            Join the Waitlist
          </button>
        </header>

        {/* Hero Section */}
        <section ref={sectionRef} className="relative isolate w-full overflow-hidden px-6 pb-16 sm:pb-24 lg:px-12">
          <div className="mx-auto grid max-w-7xl grid-cols-12 items-start gap-x-8 gap-y-10">
            {/* Copy column */}
            <div className="relative z-20 col-span-12 mt-[54px] max-w-[780px] space-y-[32px] md:col-span-7 lg:h-[897px]">
              <h1 className="font-medium leading-[1.05] tracking-[-0.04em] text-black" style={{ fontFamily: '"Neue Montreal"', fontSize: "clamp(2.75rem, 6vw, 5rem)" }}>
                Your curiosity deserves
                <br />
                a comeback.
              </h1>
              <p className="text-lg leading-relaxed text-slate-700">
                Remember when learning felt like play? When you explored things
                just because they sparked joy?
              </p>
              <p className="text-lg leading-relaxed text-slate-700">
                Two Cents Club brings that feeling
                back. Join a community of curious minds where passion meets
                growth—one who still believes in wonder. Explore new skills, meet
                curious people, and invest your fully in your curiosities.
              </p>
              <Button
                onClick={() => setStep("email")}
                ref={ctaRef}
                className="rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
              >
                Join the Waitlist
              </Button>
            </div>

            {/* Artboard column (places images by % inside a stable box) */}
            <div className="relative col-span-12 h-[520px] md:col-span-5 md:h-[520px] lg:h-[897px]">
              {/* penny directly across from the headline */}
              <img
                src="/images/2C-Landing-Assets/penny.png"
                alt=""
                className="hero-nudge pointer-events-none absolute z-10 w-[120px] sm:w-[128px] lg:w-[152px]"
                style={{ top: "10%", left: "8%", filter: "drop-shadow(0 18px 32px rgba(0,0,0,0.18))", '--tx': '50px', '--ty': '0px', '--rot': '-10deg', '--sc': '1' } as React.CSSProperties}
              />
              {/* star moved to the paper wrapper below so it follows the paper */}
              {/* cd moved to the baseline row */}
              {/* ruled paper stack moved to be pinned to the viewport right edge */}
              {/* bowl moved to the baseline row */}
              {/* compass moved to the baseline row */}
              {/* paper clip accent moved to viewport left edge below */}
            </div>
          </div>

          {/* Baseline row below the text */}
          {rowTop !== null && (
            <div
              className="pointer-events-none absolute left-0 right-0 hidden sm:block"
              style={{ top: rowTop }}
            >
              <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
                <div className="flex h-[240px] items-end justify-between gap-6 lg:h-[280px]">
                  {/* compass */}
                  <img
                    src="/images/2C-Landing-Assets/compass.png"
                    alt=""
                    className="hero-nudge w-[120px] lg:w-[140px]"
                    style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.18))", '--tx': '-20px', '--ty': '80px', '--rot': '6deg', '--sc': '1.5' } as React.CSSProperties}
                  />
                  {/* bowl */}
                  <img
                    src="/images/2C-Landing-Assets/bowl.png"
                    alt=""
                    className="hero-nudge w-[200px] lg:w-[240px]"
                    style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.14))", '--tx': '-30px', '--ty': '80px', '--rot': '0deg', '--sc': '1.25' } as React.CSSProperties}
                  />
                  {/* pen */}
                  <img
                    src="/images/2C-Landing-Assets/pen.png"
                    alt=""
                    className="hero-nudge w-[80px] lg:w-[96px]"
                    style={{ filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.14))", '--tx': '-50px', '--ty': '-6px', '--rot': '-2deg', '--sc': '1.25' } as React.CSSProperties}
                  />
                  {/* cd */}
                  <img
                    src="/images/2C-Landing-Assets/cd.png"
                    alt=""
                    className="hero-nudge w-[180px] lg:w-[220px]"
                    style={{ filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.16))", '--tx': '-120px', '--ty': '-180px', '--rot': '-6deg', '--sc': '1' } as React.CSSProperties}
                  />
                </div>
                {/* paper clip pinned to the left screen edge moved to section level */}
              </div>
            </div>
          )}
          {/* Paper pinned to right screen edge with star overlay (see wrapper below) */}
          {/* Paper clip pinned to viewport left edge near the baseline row (nudgeable) */}
          {rowTop !== null && (
            <img
              src="/images/2C-Landing-Assets/paper-clip.png"
              alt=""
              className="hero-nudge pointer-events-none absolute left-0 -ml-6 hidden sm:block lg:-ml-12"
              style={{ top: `${rowTop + 25}px`, width: "clamp(44px, 5vw, 72px)", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.12))", '--tx': '70px', '--ty': '30px', '--rot': '-12deg', '--sc': '3' } as React.CSSProperties}
            />
          )}

          {/* Paper pinned to right screen edge with star overlay, wrapper keeps them together */}
          <div
            className="pointer-events-none absolute right-0 -mr-6 top-[16%] hidden sm:block lg:-mr-12"
            style={{ width: "clamp(260px, 30vw, 520px)" }}
          >
            <div className="relative w-full">
              <img
                src="/images/2C-Landing-Assets/paper.png"
                alt=""
                className="w-full rotate-[3deg]"
                style={{ filter: "drop-shadow(0 28px 42px rgba(0,0,0,0.18))" }}
              />
              <img
                src="/images/2C-Landing-Assets/gold star.png"
                alt=""
                className="hero-nudge pointer-events-none absolute z-30"
                style={{ top: "8%", left: "70%", width: "clamp(40px, 5vw, 68px)", filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.14))", transformOrigin: "center", '--tx': '-90px', '--ty': '70px', '--rot': '0deg', '--sc': '2' } as React.CSSProperties}
              />
            </div>
          </div>
        </section>

        {/* Three Feature Sections Container */}
        <div className="bg-white px-12 py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            {/* Discover Experiences Section */}
            <section className="rounded-[16px] bg-[#A94442] px-6 py-20 text-white lg:px-12">
              <div className="relative mx-auto max-w-6xl">
                <div className="max-w-xl">
                  <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
                    Discover experiences made for you.
                  </h2>
                  <p className="text-lg leading-relaxed">
                    We curated just enough choice to explore something that fires
                    your interests, but not so many that choosing is hard. Explore
                    experiences about what you&rsquo;re curious about, what marks the
                    real.
                  </p>
                </div>
                <img
                  src="/images/2C-Landing-Assets/palette.png"
                  alt=""
                  className="absolute left-[5%] bottom-[10%] w-20 -rotate-12 lg:w-24"
                />
                <img
                  src="/images/2C-Landing-Assets/art-pieces.png"
                  alt="Art and creative experiences"
                  className="absolute right-0 top-1/2 w-48 -translate-y-1/2 rotate-6 lg:w-64"
                />
              </div>
            </section>

            {/* Collect Memories Section */}
            <section className="rounded-[16px] bg-[#4A90E2] px-6 py-20 text-white lg:px-12">
              <div className="mx-auto flex max-w-6xl items-center gap-12">
                <div className="flex-1">
                  <img
                    src="/images/2C-Landing-Assets/sticker-sheet.png"
                    alt="Sticker collection"
                    className="w-full max-w-md"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
                    Collect memories (and stickers).
                  </h2>
                  <p className="text-lg leading-relaxed">
                    Track your progress, celebrate small wins. Stick cool stickers
                    onto your curiosity patchboard, because growth has to stay fun
                    in the journey, not the fun.
                  </p>
                </div>
              </div>
            </section>

            {/* Meet People Section */}
            <section className="rounded-[16px] bg-[#4A9B8E] px-6 py-20 text-white lg:px-12">
              <div className="mx-auto flex max-w-6xl items-center gap-12">
                <div className="flex-1">
                  <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
                    Meet people who make you think.
                  </h2>
                  <p className="text-lg leading-relaxed">
                    Join in-person (and occasionally digital) as we host one another. Learn something new together. Connect deeply
                    with people who share the same fire for your interests.
                  </p>
                </div>
                <div className="flex-1">
                  <img
                    src="/images/2C-Landing-Assets/tcc-circle.png"
                    alt="Two Cents Club circle"
                    className="w-full max-w-md"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Testimonials Section */}
        <section className="relative bg-white px-6 py-20 lg:px-12">
          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mb-12 flex items-center justify-center gap-8">
              <img
                src="/images/2C-Landing-Assets/ethan.png"
                alt="Ethan"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="text-3xl">→</div>
              <img
                src="/images/2C-Landing-Assets/eyeball-doodle.png"
                alt=""
                className="w-12"
              />
            </div>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              Loved by learners of all kinds.
            </h2>
            <p className="mb-8 text-lg text-gray-700">
              Inspired to much, truly grateful to Two Cents for the welcoming
              community it creates in learning!
            </p>
            <div className="flex items-center justify-center gap-8">
              <img
                src="/images/2C-Landing-Assets/doodle1.png"
                alt=""
                className="w-8"
              />
              <img
                src="/images/2C-Landing-Assets/mia.png"
                alt="Mia"
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
            <p className="mt-8 text-lg text-gray-700">
              Inspired to much, truly grateful to Two Cents for the welcoming
              community it creates in learning!
            </p>

            {/* Decorative elements */}
            <img
              src="/images/2C-Landing-Assets/paper-sheets.png"
              alt=""
              className="absolute right-[8%] top-[20%] w-28 rotate-6 opacity-60 lg:w-36"
            />
            <img
              src="/images/2C-Landing-Assets/candle-doodle.png"
              alt=""
              className="absolute right-[5%] bottom-[10%] w-16 lg:w-20"
            />
            <img
              src="/images/2C-Landing-Assets/doodle2.png"
              alt=""
              className="absolute left-[15%] top-[30%] w-10 lg:w-12"
            />
          </div>
        </section>

        {/* Final CTA Section */}
        <div className="bg-white px-12 py-12">
          <section className="relative overflow-hidden rounded-[16px] bg-[#5A7A5E] px-6 py-32 text-center text-white lg:px-12">
            <img
              src="/images/2C-Landing-Assets/bg-gathering.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="mb-6 text-4xl font-bold lg:text-5xl">
                Ready to learn something new?
              </h2>
              <p className="mb-8 text-lg leading-relaxed">
                Invest in your mind, feed your curiosity, and meet this kind of
                people who challenge you to grow. Join Two Cents Club.
              </p>
              <Button
                onClick={() => setStep("email")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-medium text-[#5A7A5E] hover:bg-gray-100"
              >
                <img
                  src="/images/2C-Landing-Assets/handClapping.svg"
                  alt=""
                  className="h-5 w-5"
                />
                Join the Waitlist
              </Button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white px-6 py-8 lg:px-12">
          <div className="relative mx-auto flex max-w-6xl items-center justify-center">
            <span className="absolute left-0 text-sm text-gray-600">© Two Cents Club</span>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                X
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                LinkedIn
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Instagram
              </a>
            </div>
            <span className="absolute right-0 text-sm text-gray-600">Restoring child-like curiosity</span>
          </div>
        </footer>
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
