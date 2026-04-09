"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import FloatingBoxButton from "@/components/floating-box-button";
import { SiteNavbar } from "@/components/app-navbar";
import { FEATURED_EVENT } from "@/lib/featured-event";
import { SiteFooter } from "@/components/site-footer";
import type { ClassWithMeta } from "@/lib/class-queries";
import { formatDateRange, formatTimeRange } from "@/lib/format";
import { TOMO } from "@/lib/constants";

interface HomepageLandingProps {
  isLoggedIn?: boolean;
  firstName?: string;
  featuredEvent?: ClassWithMeta | null;
}

export function HomepageLanding({ isLoggedIn = false, firstName, featuredEvent }: HomepageLandingProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const openAuth = () => setAuthOpen(true);

  const dateLabel = featuredEvent ? formatDateRange(featuredEvent.start_date, featuredEvent.end_date) : null;
  const timeLabel = featuredEvent ? formatTimeRange(featuredEvent.start_time, featuredEvent.end_time) : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <SiteNavbar isLoggedIn={isLoggedIn} firstName={firstName} />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative w-full">
        <img
          src="/images/2C-Landing-Assets/hero-small.png"
          alt=""
          className="w-full h-auto lg:hidden"
        />
        <div className="lg:bg-[url('/images/2C-Landing-Assets/hero-format.png')] lg:bg-[length:100%_auto] lg:bg-no-repeat lg:bg-top lg:[min-height:clamp(560px,61vw,960px)]">
          <div className="px-6 pt-8 pb-4 lg:pt-16 lg:px-12">
            <div className="mx-auto grid max-w-6xl grid-cols-12 items-start gap-x-8 gap-y-10">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Event ─────────────────────────────────── */}
      <section className="px-6 py-16 md:px-12 bg-[#FFFEED]">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-6">
            Upcoming Event
          </p>

          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm lg:flex">
            {/* Image */}
            <div className="lg:w-[55%] shrink-0">
              <img
                src={featuredEvent?.image_url ?? ""}
                alt={featuredEvent?.title ?? ""}
                className="w-full h-64 lg:h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-8 lg:p-10 flex flex-col justify-center gap-6">
              <div className="space-y-3">
                <h2
                  className="text-3xl lg:text-4xl leading-tight text-gray-900"
                  style={TOMO}
                >
                  {featuredEvent?.title}
                </h2>

                <div className="flex flex-col gap-1.5 text-sm text-black">
                  {(dateLabel || timeLabel) && (
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{[dateLabel, timeLabel].filter(Boolean).join(" · ")}</span>
                    </div>
                  )}
                  {featuredEvent?.location_details && (
                    <div className="flex items-start gap-2">
                      <span>📍</span>
                      <span>{featuredEvent.location_details}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-gray-600 line-clamp-5 whitespace-pre-line">
                {featuredEvent?.description}
              </p>

              <Link
                href={FEATURED_EVENT.path}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#C94256] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#a33045]"
              >
                View event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Sections ────────────────────────────────── */}
      <div className="bg-white px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
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
        <div className="relative mx-auto max-w-6xl">
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
        <div className="mx-auto max-w-6xl">
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
                Join the Club
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <SiteFooter showTagline={false} />
      <FloatingBoxButton />
    </div>
  );
}
