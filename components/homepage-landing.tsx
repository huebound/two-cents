"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { PublicClassCard } from "@/components/public-class-card";
import type { ClassWithPrice } from "@/lib/mock-classes";

const TOMO = { fontFamily: "var(--font-tomo-bossa)" };

interface HomepageLandingProps {
  classes: ClassWithPrice[];
}

export function HomepageLanding({ classes }: HomepageLandingProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const openAuth = () => setAuthOpen(true);

  // Show up to 6 in the carousel (3 visible at a time on desktop)
  const featuredClasses = classes.slice(0, 6);
  const hasClasses = classes.length > 0;

  // Carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    // Set initial arrow state once layout settles
    const id = setTimeout(updateArrows, 50);
    return () => clearTimeout(id);
  }, [updateArrows, featuredClasses.length]);

  const scrollCarousel = (dir: "prev" | "next") => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "next" ? el.clientWidth : -el.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 md:py-8">
        <div className="mx-auto flex w-full max-w-7xl items-start justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src="/images/2C-Landing-Assets/googly-eye.png"
              alt="Two Cents Club"
              className="h-6 w-6 md:h-10 md:w-10"
            />
            <span
              className="font-medium text-black text-base md:text-[24px]"
              style={TOMO}
            >
              Two Cents Club
            </span>
          </div>
          <nav className="flex items-center gap-5 md:gap-8">
            <Link
              href="/browse"
              className="font-medium text-black hover:underline text-sm md:text-[18px]"
              style={TOMO}
            >
              Classes
            </Link>
            <button
              className="cursor-pointer font-medium text-black hover:underline text-sm md:text-[18px]"
              style={TOMO}
              onClick={openAuth}
            >
              Join the Club
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative w-full">
        <img
          src="/images/2C-Landing-Assets/hero-small.png"
          alt=""
          className="w-full h-auto lg:hidden mt-16 md:mt-24"
        />
        <div className="lg:bg-[url('/images/2C-Landing-Assets/hero-full.png')] lg:bg-[length:100%_auto] lg:bg-no-repeat lg:bg-top lg:[min-height:clamp(560px,61vw,960px)]">
          <div className="px-6 pt-8 pb-4 lg:pt-20 lg:px-12">
            <div className="mx-auto grid max-w-7xl grid-cols-12 items-start gap-x-8 gap-y-10">
              <div className="relative z-20 col-span-12 mt-0 lg:mt-[80px] lg:max-w-[640px] space-y-[32px] md:col-span-12 mx-auto md:mx-0">
                <h1
                  className="leading-[1.05] tracking-[-0.04em] text-left"
                  style={{
                    ...TOMO,
                    letterSpacing: "-0.01em",
                    fontSize: "clamp(2.75rem, 6vw, 5rem)",
                  }}
                >
                  Your curiosity deserves
                  <br />a comeback.
                </h1>
                <div className="space-y-[8px]">
                  <p className="text-l tracking-[-0.01em] text-black text-left">
                    Remember when learning felt like play? When you explored
                    things just because they sparked joy?
                  </p>
                  <p className="text-l tracking-[-0.01em] text-black text-left">
                    Two Cents Club brings that feeling back. Join a community of
                    curious minds where passion meets growth—those who still
                    believe in wonder. Explore new skills, meet curious people,
                    and invest fully in your curiosities.
                  </p>
                </div>
                <div className="flex justify-center md:justify-start">
                  <Button
                    onClick={openAuth}
                    className="rounded-full cursor-pointer bg-[#F6DE27] px-6 py-5 text-base font-medium text-black transition-colors hover:bg-[#DFC711]"
                  >
                    Attend a Class
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Classes carousel ───────────────────────── */}
      {hasClasses && (
        <section className="py-16 px-6 md:px-12">
          <div className="mx-auto max-w-7xl">
            {/* Section header */}
            <div className="mb-8 flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Happening now
                </p>
                <h2
                  className="text-4xl font-bold leading-tight lg:text-5xl"
                  style={{ ...TOMO, letterSpacing: "0.02em" }}
                >
                  Classes this season.
                </h2>
              </div>

              {/* Arrow controls + View all */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel("prev")}
                  disabled={!canPrev}
                  aria-label="Previous classes"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollCarousel("next")}
                  disabled={!canNext}
                  aria-label="Next classes"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <Link
                  href="/browse"
                  className="ml-2 hidden text-sm font-medium text-gray-400 hover:text-black transition-colors sm:block"
                >
                  View all →
                </Link>
              </div>
            </div>

            {/* Scrollable track — 3 cards visible at once on desktop */}
            <div
              ref={carouselRef}
              onScroll={updateArrows}
              className="flex gap-5 overflow-x-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
            >
              {featuredClasses.map((cls, i) => (
                <PublicClassCard
                  key={cls.id}
                  id={cls.id}
                  title={cls.title}
                  imageUrl={cls.image_url}
                  startDate={cls.start_date}
                  startTime={cls.start_time}
                  endTime={cls.end_time}
                  meetingDays={cls.meeting_days}
                  level={cls.level}
                  locationTag={cls.location_tag}
                  spotsLeft={cls.spotsLeft}
                  price={cls.price}
                  accentIndex={i}
                  featured
                  className="snap-start shrink-0 min-w-[calc(100%-20px)] sm:min-w-[calc(50%-10px)] lg:min-w-[calc(33.333%-14px)]"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Feature Sections ────────────────────────────────── */}
      <div className="bg-white px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {/* Discover */}
          <section className="overflow-hidden rounded-[16px] bg-[#C94256] px-12 py-12 text-white md:py-20 lg:px-12">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:gap-12">
              <div className="min-w-0 flex-1">
                <h2
                  className="mb-4 text-4xl font-bold lg:text-5xl leading-[1.3em]"
                  style={{ ...TOMO, letterSpacing: "0.03em" }}
                >
                  Discover experiences made just for you.
                </h2>
                <p className="text-lg">
                  We curated just enough choice to explore something that fires
                  your interests, but not so many that choosing is hard. Explore
                  experiences about what you&rsquo;re curious about, what marks
                  the real.
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

          {/* Collect */}
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
                <h2
                  className="mb-4 text-4xl font-bold lg:text-5xl leading-[1.3em]"
                  style={{ ...TOMO, letterSpacing: "0.03em" }}
                >
                  Collect memories (and stickers).
                </h2>
                <p className="text-lg">
                  Track your progress, celebrate small wins. Stick cool stickers
                  onto your curiosity patchboard, because growth has to stay fun
                  in the journey, not the fun.
                </p>
              </div>
            </div>
          </section>

          {/* Meet */}
          <section className="overflow-hidden rounded-[16px] bg-[#4A9B8E] px-12 py-12 text-white md:py-20 lg:px-12">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:gap-12">
              <div className="min-w-0 flex-1">
                <h2
                  className="mb-4 text-4xl font-bold lg:text-5xl leading-[1.3em]"
                  style={{ ...TOMO, letterSpacing: "0.03em" }}
                >
                  Meet people who make you think.
                </h2>
                <p className="text-lg">
                  Join in-person as we host one another. Learn something new
                  together. Connect deeply with people who share the same fire
                  for your interests.
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

      {/* ── Testimonials ────────────────────────────────────── */}
      <section
        className="relative px-6 py-20 lg:px-12"
        style={{
          backgroundImage:
            "url('/images/2C-Landing-Assets/paper-with-doodles.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex items-end gap-3 md:gap-5 max-w-sm md:max-w-xl lg:max-w-3xl">
            <img
              src="/images/2C-Landing-Assets/ethan.png"
              alt="Ethan"
              className="flex-shrink-0 w-24 md:w-36 lg:w-48"
            />
            <div className="relative min-w-0 flex-1 -translate-y-10 md:-translate-y-12">
              <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl md:px-5 md:py-4">
                <p className="text-sm md:text-base">
                  &ldquo;I learned so much... truly grateful to Two Cents for
                  the welcoming community &amp; wonderful learning.&rdquo;
                </p>
                <p className="mt-2 text-xs font-medium md:text-sm">— Ethan</p>
              </div>
            </div>
          </div>

          <div className="mb-8 text-center mx-auto max-w-lg">
            <h2
              className="mb-3 leading-[1.25em]"
              style={{
                ...TOMO,
                letterSpacing: "0.03em",
                fontSize: "clamp(2.75rem, 6vw, 4rem)",
              }}
            >
              Loved by learners
              <br /> of all kinds.
            </h2>
          </div>

          <div className="flex items-start gap-3 md:gap-5 max-w-sm md:max-w-xl lg:max-w-3xl ml-auto">
            <div className="relative min-w-0 flex-1 translate-y-6 md:translate-y-12">
              <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl md:px-5 md:py-4">
                <p className="text-sm md:text-base">
                  &ldquo;I&rsquo;ve had a blast discovering all the classes Two
                  Cents has to offer. From candlemaking to coffee, I&rsquo;ve
                  begun to explore things I never thought I&rsquo;d have the
                  chance to. Forever grateful!&rdquo;
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
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <div className="bg-white px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <section className="relative overflow-hidden rounded-[16px] px-6 py-32 text-center text-white lg:px-12">
            <img
              src="/images/2C-Landing-Assets/bg-gathering.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-10 px-4 md:px-12 mx-auto max-w-2xl">
              <h2
                className="mb-6 leading-[1.25em]"
                style={{
                  ...TOMO,
                  letterSpacing: "0.03em",
                  fontSize: "clamp(2.75rem, 6vw, 4rem)",
                }}
              >
                Ready to learn something new?
              </h2>
              <p className="mb-8 text-l lg:text-xl tracking-[-0.01em]">
                Invest in your mind, feed your curiosity, and meet the kind of
                people who challenge you to grow. Join Two Cents Club.
              </p>
              <Button
                onClick={openAuth}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-5 text-base font-medium text-[#5A7A5E] hover:bg-gray-100"
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

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-white px-6 py-8 md:px-12">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between md:justify-center">
          <span className="text-sm text-gray-600 md:absolute md:left-0">
            © Two Cents Club
          </span>
          <div className="flex gap-6">
            <a
              href="https://x.com/thetwocentsclub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              X
            </a>
            <a
              href="https://www.linkedin.com/company/two-cents-club/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/thetwocentsclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
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
