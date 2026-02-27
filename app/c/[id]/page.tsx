import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getClassById } from "@/lib/class-queries";
import { getMockClassById, type ClassWithPrice } from "@/lib/mock-classes";
import { formatDateRange, formatDuration, formatTimeRange } from "@/lib/format";
import { RegisterCTA } from "./register-cta";

const ACCENT_COLORS = ["#C94256", "#4A90E2", "#4A9B8E", "#D97706"];

const TOMO = { fontFamily: "var(--font-tomo-bossa)" };

function accentForId(id: string) {
  const hash = Math.abs(
    id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  );
  return ACCENT_COLORS[hash % ACCENT_COLORS.length];
}

export default async function PublicClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let classData: ClassWithPrice | null = null;
  try {
    const supabase = await createClient();
    classData = (await getClassById(supabase, id)) as ClassWithPrice | null;
  } catch {
    // fall through to mock
  }

  if (!classData) {
    const mock = getMockClassById(id);
    if (!mock) notFound();
    classData = mock;
  }

  const accentColor = accentForId(id);
  const dateRange = formatDateRange(classData.start_date, classData.end_date);
  const timeRange = formatTimeRange(classData.start_time, classData.end_time);
  const duration = formatDuration(classData.start_time, classData.end_time);
  const weeksLabel = `${classData.weeks} ${classData.weeks === 1 ? "week" : "weeks"}`;
  const spotsLeft = classData.spotsLeft;
  const isFull = spotsLeft === 0;
  const spotsLabel = isFull
    ? "Fully booked"
    : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`;
  const requirements = classData.requirements ?? "Nothing special required.";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 px-6 py-4 md:px-12 md:py-6 bg-white border-b border-gray-100">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img
              src="/images/2C-Landing-Assets/googly-eye.png"
              alt="Two Cents Club"
              className="h-6 w-6 md:h-9 md:w-9"
            />
            <span
              className="font-medium text-black text-base md:text-[22px]"
              style={TOMO}
            >
              Two Cents Club
            </span>
          </Link>
          <nav className="flex items-center gap-5 md:gap-8">
            <Link
              href="/browse"
              className="font-medium text-black hover:underline text-sm md:text-[18px]"
              style={TOMO}
            >
              Classes
            </Link>
            <Link
              href="/"
              className="font-medium text-black hover:underline text-sm md:text-[18px]"
              style={TOMO}
            >
              Join the Club
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero image — full bleed ──────────────────────── */}
        <div className="relative">
          {classData.image_url ? (
            <img
              src={classData.image_url}
              alt={classData.title}
              className="h-64 w-full object-cover md:h-[480px]"
            />
          ) : (
            <div
              className="h-48 w-full md:h-80"
              style={{ backgroundColor: `${accentColor}22` }}
            />
          )}
          {/* Accent bar at bottom of image */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* ── Title block ─────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="py-8 lg:grid lg:grid-cols-3 lg:gap-16">
            {/* Left: title + meta */}
            <div className="lg:col-span-2 space-y-5">
              <Link
                href="/browse"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                ← All classes
              </Link>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {classData.level} &bull; {classData.location_tag}
                </p>
                <h1
                  className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
                  style={TOMO}
                >
                  {classData.title}
                </h1>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600">
                  {weeksLabel}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-sm font-semibold"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  {spotsLabel}
                </span>
                {classData.price && (
                  <span className="rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-900">
                    {classData.price}
                  </span>
                )}
              </div>
            </div>

            {/* Right: register card (desktop only at this position) */}
            <div className="hidden lg:block lg:col-span-1">
              <div
                className="rounded-2xl p-6 space-y-4"
                style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}20` }}
              >
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 shrink-0">Schedule</dt>
                    <dd className="font-medium text-gray-900 text-right">{classData.meeting_days}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 shrink-0">Dates</dt>
                    <dd className="font-medium text-gray-900 text-right">{dateRange}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 shrink-0">Time</dt>
                    <dd className="font-medium text-gray-900 text-right">{timeRange}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 shrink-0">Location</dt>
                    <dd className="font-medium text-gray-900 text-right">{classData.location_tag}</dd>
                  </div>
                  {classData.price && (
                    <div className="flex justify-between gap-3 pt-1 border-t border-gray-200">
                      <dt className="text-gray-500 shrink-0">Price</dt>
                      <dd className="font-bold text-gray-900 text-right">{classData.price}</dd>
                    </div>
                  )}
                </dl>
                <RegisterCTA classTitle={classData.title} isFull={isFull} />
                <p className="text-center text-xs text-gray-400">
                  You&apos;ll need a free account to register.
                </p>
              </div>
            </div>
          </div>

          {/* ── Schedule strip (visible on all sizes) ─────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 rounded-2xl border border-gray-100 mb-12">
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Frequency</p>
              <p className="font-semibold text-gray-900 leading-snug">{classData.meeting_days}</p>
              <p className="text-sm text-gray-500 mt-0.5">{classData.schedule_summary}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Time</p>
              <p className="font-semibold text-gray-900 leading-snug">{timeRange}</p>
              <p className="text-sm text-gray-500 mt-0.5">{duration}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Dates</p>
              <p className="font-semibold text-gray-900 leading-snug">{dateRange}</p>
              <p className="text-sm text-gray-500 mt-0.5">{weeksLabel}</p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Location</p>
              <p className="font-semibold text-gray-900 leading-snug">{classData.location_tag}</p>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{classData.location_details}</p>
            </div>
          </div>

          {/* ── Body content ────────────────────────────────── */}
          <div className="pb-20 lg:grid lg:grid-cols-3 lg:gap-16">
            {/* Left: long-form content */}
            <div className="space-y-12 lg:col-span-2">
              {classData.description && (
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    About this class
                  </h2>
                  <p className="text-base leading-[1.8] text-gray-600 whitespace-pre-line">
                    {classData.description}
                  </p>
                </section>
              )}

              <section>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  What you&apos;ll need
                </h2>
                <p className="text-base leading-[1.8] text-gray-600">
                  {requirements}
                </p>
              </section>

              {classData.host_blurb && (
                <section>
                  <h2 className="mb-5 text-xl font-semibold text-gray-900">
                    Meet your host
                  </h2>
                  <div className="flex gap-5">
                    {/* Avatar */}
                    <div
                      className="h-14 w-14 shrink-0 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: accentColor }}
                      aria-hidden="true"
                    >
                      {classData.title.charAt(0)}
                    </div>
                    <p className="text-base leading-[1.8] text-gray-600 whitespace-pre-line">
                      {classData.host_blurb}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Right: sticky register card (desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-lg font-bold text-gray-900 leading-snug">{classData.title}</p>
                <RegisterCTA classTitle={classData.title} isFull={isFull} />
                <p className="text-center text-xs text-gray-400">
                  You&apos;ll need a free account to register.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile register CTA */}
          <div className="lg:hidden pb-12">
            <RegisterCTA classTitle={classData.title} isFull={isFull} />
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-gray-100 bg-white px-6 py-8 md:px-12">
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
