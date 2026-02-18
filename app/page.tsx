"use client";

import { useEffect, useState } from "react";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

    // Save the user's name to their profile
    if (firstName || lastName) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            first_name: firstName || null,
            last_name: lastName || null,
          } as never,
          { onConflict: "id" }
        );

      if (profileError) {
        setIsLoading(false);
        setError("Sign in successful, but we couldn't save your name. Please update it in your profile.");
        // Still proceed to success since auth worked
        setStep("success");
        return;
      }
    }

    setIsLoading(false);

    // Show success screen instead of routing
    setStep("success");
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
        <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 md:py-8">
          <div className="mx-auto flex w-full max-w-7xl items-start justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src="/images/2C-Landing-Assets/googly-eye.png"
              alt="Two Cents Club"
              className="h-6 w-6 md:h-10 md:w-10"
            />
            <span className="font-medium text-black text-base md:text-[24px]"
              style={{
                fontFamily: 'TOMO Bossa',
              }}
            >
              Two Cents Club
            </span>
          </div>
          <button
            className="font-medium text-black hover:underline text-base md:text-[24px]"
            style={{
                fontFamily: 'TOMO Bossa',
            }}
            onClick={() => setStep("email")}
          >
            Join the Club
          </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative w-full">
          {/* Mobile/tablet: hero image stacked above text */}
          <img
            src="/images/2C-Landing-Assets/hero-small.png"
            alt=""
            className="w-full h-auto lg:hidden mt-16 md:mt-24"
          />
          {/* Desktop: full-width background image; mobile: plain */}
          <div className="lg:bg-[url('/images/2C-Landing-Assets/hero-full.png')] lg:bg-[length:100%_auto] lg:bg-no-repeat lg:bg-top lg:[min-height:clamp(560px,61vw,960px)]">
          <div className="px-6 pt-8 pb-4 lg:pt-20 lg:px-12">
          <div className="mx-auto grid max-w-7xl grid-cols-12 items-start gap-x-8 gap-y-10">
            {/* Copy column */}
            <div className="relative z-20 col-span-12 mt-0 lg:mt-[80px] lg:max-w-[640px] space-y-[32px] md:col-span-12 mx-auto md:mx-0">
              <h1
                className="leading-[1.05] tracking-[-0.04em] text-left"
                style={{
                  fontFamily: 'TOMO Bossa',
                  letterSpacing: '-0.01em',
                  fontSize: "clamp(2.75rem, 6vw, 5rem)",
                }}
              >
                Your curiosity deserves 
                <br/>a comeback.
              </h1>
              <div className="space-y-[8px]">
              <p className="text-l tracking-[-0.01em] text-black text-left">
                Remember when learning felt like play? When you explored things
                just because they sparked joy?
              </p>
              <p className="text-l tracking-[-0.01em] text-black text-left">
                Two Cents Club brings that feeling back. Join a community of
                curious minds where passion meets growth—one who still believes
                in wonder. Explore new skills, meet curious people, and invest
                your fully in your curiosities.
              </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <Button
                  onClick={() => setStep("email")}
                  className="rounded-full bg-[#F6DE27] px-6 py-5 text-base font-medium text-black transition-colors hover:bg-[#DFC711]"
                >
                  Attend a Class
                </Button>
              </div>
            </div>

          </div>
          </div>
          </div>
        </section>

        {/* Three Feature Sections Container */}
        <div className="bg-white px-6 py-12 md:px-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            {/* Discover Experiences Section */}
            <section className="overflow-hidden rounded-[16px] bg-[#C94256] px-12 py-12 text-white md:py-20 lg:px-12">
              <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:gap-12">
                <div className="min-w-0 flex-1">
                  <h2 className="mb-4 text-4xl font-bold lg:text-5xl leading-[1.3em]"
                    style={{
                      fontFamily: 'TOMO Bossa',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Discover experiences made just for you.
                  </h2>
                  <p className="text-lg">
                    We curated just enough choice to explore something that
                    fires your interests, but not so many that choosing is hard.
                    Explore experiences about what you&rsquo;re curious about,
                    what marks the real.
                  </p>
                </div>
                <div className="w-full flex-1">
                  <img
                    src="/images/2C-Landing-Assets/art-pieces.png"
                    alt="Art pieces"
                    className="w-full"
                  />
                </div>
              </div>
            </section>

            {/* Collect Memories Section */}
            <section className="overflow-hidden rounded-[16px] bg-[#4A90E2] px-12 py-12 text-white md:py-20 lg:px-12">
              <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-8 md:flex-row md:gap-12">
                <div className="w-full flex-1">
                  <img
                    src="/images/2C-Landing-Assets/punchcard.png"
                    alt="Sticker collection"
                    className="w-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="mb-4 text-4xl font-bold lg:text-5xl leading-[1.3em]"
                    style={{
                      fontFamily: 'TOMO Bossa',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Collect memories (and stickers).
                  </h2>
                  <p className="text-lg">
                    Track your progress, celebrate small wins. Stick cool
                    stickers onto your curiosity patchboard, because growth has
                    to stay fun in the journey, not the fun.
                  </p>
                </div>
              </div>
            </section>

            {/* Meet People Section */}
            <section className="overflow-hidden rounded-[16px] bg-[#4A9B8E] px-12 py-12 text-white md:py-20 lg:px-12">
              <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:gap-12">
                <div className="min-w-0 flex-1">
                  <h2 className="mb-4 text-4xl font-bold lg:text-5xl leading-[1.3em]"
                    style={{
                      fontFamily: 'TOMO Bossa',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Meet people who make you think.
                  </h2>
                  <p className="text-lg">
                    Join in-person as we host one another.
                    Learn something new together. Connect deeply with
                    people who share the same fire for your interests.
                  </p>
                </div>
                <div className="w-full flex-1">
                  <img
                    src="/images/2C-Landing-Assets/candle-workshop.png"
                    alt="Two Cents Club circle"
                    className="w-full"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Testimonials Section */}
        <section
          className="relative px-6 py-20 lg:px-12"
          style={{
            backgroundImage: "url('/images/2C-Landing-Assets/paper-with-doodles.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative mx-auto max-w-7xl">
            {/* Ethan: far left, shifted up */}
            <div className="mb-8 flex items-end gap-3 md:gap-5 max-w-sm md:max-w-xl lg:max-w-3xl">
              <img
                src="/images/2C-Landing-Assets/ethan.png"
                alt="Ethan"
                className="flex-shrink-0 w-24 md:w-36 lg:w-48"
              />
              <div className="relative min-w-0 flex-1 -translate-y-10 md:-translate-y-12">
                <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl md:px-5 md:py-4">
                  <p className="text-sm md:text-base">
                    &ldquo;I learned so much... truly grateful to Two Cents for the welcoming community &amp; wonderful learning.&rdquo;
                  </p>
                  <p className="mt-2 text-xs font-medium md:text-sm">— Ethan</p>
                </div>
              </div>
            </div>

            {/* Heading centered */}
            <div className="mb-8 text-center mx-auto max-w-lg">
              <h2 className="mb-3 leading-[1.25em]"
                style={{
                  fontFamily: 'TOMO Bossa',
                  letterSpacing: '0.03em',
                  fontSize: "clamp(2.75rem, 6vw, 4rem)",
                }}
              >
                Loved by learners
                <br/> of all kinds.
              </h2>
              <img
                src="/images/2C-Landing-Assets/doodle2.png"
                alt=""
                className="mx-auto w-full max-w-xs"
              />
            </div>

            {/* Mia: far right, shifted down */}
            <div className="flex items-start gap-3 md:gap-5 max-w-sm md:max-w-xl lg:max-w-3xl ml-auto">
              <div className="relative min-w-0 flex-1 translate-y-6 md:translate-y-12">
                <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl md:px-5 md:py-4">
                  <p className="text-sm md:text-base">
                    &ldquo;I&rsquo;ve had a blast discovering all the classes Two Cents has to offer. From candlemaking to coffee, I&rsquo;ve begun to explore things I never thought I&rsquo;d have the chance to. Forever grateful!&rdquo;
                  </p>
                  <p className="mt-2 text-xs font-medium md:text-sm">— Mia</p>
                </div>
              </div>
              <img
                src="/images/2C-Landing-Assets/mia-decorated.png"
                alt="Mia"
                className="flex-shrink-0 w-24 md:w-36 lg:w-48"
              />
            </div>

            {/* Decorative elements */}
            <img
              src="/images/2C-Landing-Assets/doodle1.png"
              alt=""
              className="absolute left-[2%] bottom-[5%] w-7 opacity-70"
            />
          </div>
        </section>

        {/* Final CTA Section */}
        <div className="bg-white px-6 py-12 md:px-12">
          <div className="mx-auto max-w-7xl">
          <section className="relative overflow-hidden rounded-[16px] bg-[#244729] px-6 py-32 text-center text-white lg:px-12">
            <img
              src="/images/2C-Landing-Assets/bg-gathering.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div className="relative z-10 px-12 mx-auto max-w-2xl">
              <h2 className="mb-6 leading-[1.25em]"
                style={{
                  fontFamily: 'TOMO Bossa',
                  letterSpacing: '0.03em',
                  fontSize: "clamp(2.75rem, 6vw, 4rem)",
                }}
              >
                Ready to learn something new?
              </h2>
              <p className="mb-8 text-l lg:text-xl tracking-[-0.01em]">
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
        </div>

        {/* Footer */}
        <footer className="bg-white px-6 py-8 md:px-12">
          <div className="relative mx-auto flex max-w-7xl items-center justify-between md:justify-center">
            <span className="text-sm text-gray-600 md:absolute md:left-0">
              © Two Cents Club
            </span>
            <div className="flex gap-6">
              <a href="https://x.com/thetwocentsclub" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">
                X
              </a>
              <a href="https://www.linkedin.com/company/two-cents-club/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">
                LinkedIn
              </a>
              <a href="https://www.instagram.com/thetwocentsclub/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">
                Instagram
              </a>
            </div>
            <span className="absolute right-0 text-sm text-gray-600 hidden md:block">
              Restoring child-like curiosity
            </span>
          </div>
        </footer>
      </div>
    );
  }

  if (step === "email") {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header/Nav Bar - without Join button */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-6 py-4 md:px-12 md:py-8">
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src="/images/2C-Landing-Assets/eyeball.png"
              alt="Two Cents Club"
              className="h-6 w-6 md:h-10 md:w-10"
            />
            <span className="font-medium text-black text-base md:text-[24px]">
              Two Cents Club
            </span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pt-24">
          <div className="flex w-full flex-col items-center gap-6 md:gap-8">
            <h1
              className="text-center font-sans max-w-[316px] md:max-w-[511px]"
              style={{
                color: "#000",
                fontSize: "clamp(25px, 4vw, 40px)",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "95%",
              }}
            >
              Welcome to Two Cents Club. Join our community to come to your first event!
            </h1>
            <div className="w-full max-w-[300px] md:max-w-[380px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSendOtp();
                }}
              >
                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] items-center gap-3">
                  <label className="text-base font-medium" htmlFor="firstName">
                    Name
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First"
                      autoComplete="given-name"
                      className="flex-1 h-9 text-sm"
                      required
                    />
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last"
                      autoComplete="family-name"
                      className="flex-1 h-9 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] items-center gap-3">
                  <label className="text-base font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@twocents.com"
                    autoComplete="email"
                    className="h-9 text-sm"
                    required
                  />
                </div>

                {error ? (
                  <p className="text-xs text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="flex justify-center pt-1">
                  <Button type="submit" disabled={isLoading} className="px-8 h-9 text-sm">
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header/Nav Bar - without Join button */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-6 py-4 md:px-12 md:py-8">
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src="/images/2C-Landing-Assets/eyeball.png"
              alt="Two Cents Club"
              className="h-6 w-6 md:h-10 md:w-10"
            />
            <span className="font-medium text-black text-base md:text-[24px]">
              Two Cents Club
            </span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pt-24">
          <div className="flex w-full max-w-md flex-col items-center gap-8">
            <h1
              className="text-center font-sans"
              style={{
                color: "#000",
                fontSize: "40px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "95%",
              }}
            >
              Almost in! Check your email for a confirmation code.
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
              </div>

              {error ? (
                <p className="text-sm text-red-600 text-center" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="flex justify-center">
                <Button type="submit" disabled={isLoading} className="px-8">
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header/Nav Bar - without Join button */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-6 py-4 md:px-12 md:py-8">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="/images/2C-Landing-Assets/eyeball.png"
            alt="Two Cents Club"
            className="h-6 w-6 md:h-10 md:w-10"
          />
          <span className="font-medium text-black text-base md:text-[24px]">
            Two Cents Club
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pt-24">
        <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
          <h1
            className="font-sans"
            style={{
              color: "#000",
              fontSize: "40px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "95%",
            }}
          >
            Thank you for signing up!
          </h1>
          <p className="text-lg text-gray-700">
            Keep an eye out on your inbox. We&apos;ll email you as soon as class sign-ups open.
          </p>
        </div>
      </main>
    </div>
  );
}
