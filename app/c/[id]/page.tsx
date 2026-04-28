import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getClassById } from "@/lib/class-queries";
import type { ClassWithPrice } from "@/lib/class-queries";
import { formatDateRange, formatDuration, formatTimeRange } from "@/lib/format";
import { RegisterCTA } from "@/components/register-cta";
import { SiteNavbar } from "@/components/app-navbar";
import { SiteFooter } from "@/components/site-footer";
import { getUserFirstName } from "@/lib/user-queries";
import { TOMO } from "@/lib/constants";

const ACCENT_COLORS = ["#C94256", "#4A90E2", "#4A9B8E", "#D97706"];

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
  let isLoggedIn = false;
  let firstName: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = !!user;
    firstName = user ? await getUserFirstName(supabase, user) : undefined;
    classData = (await getClassById(supabase, id, user?.id)) as ClassWithPrice | null;
  } catch {
    // fall through to notFound
  }

  if (!classData) notFound();

  const accentColor = accentForId(id);
  const dateRange = formatDateRange(classData!.start_date, classData!.end_date);
  const timeRange = formatTimeRange(classData!.start_time, classData!.end_time);
  const duration = formatDuration(classData!.start_time, classData!.end_time);
  const weeksLabel = `${classData!.weeks} ${classData!.weeks === 1 ? "week" : "weeks"}`;
  const spotsLeft = classData!.spotsLeft;
  const isFull = spotsLeft === 0;
  const spotsLabel = isFull
    ? "Fully booked"
    : spotsLeft != null
      ? `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`
      : "Open enrollment";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar isLoggedIn={isLoggedIn} firstName={firstName} />

      <main>
        {/* ── Hero ───────────────────────────────────────────── */}
        <div className="relative">
          {classData!.image_url ? (
            <img
              src={classData!.image_url}
              alt={classData!.title}
              className="h-64 w-full object-cover md:h-[440px]"
            />
          ) : (
            <div
              className="h-64 w-full md:h-[440px]"
              style={{ backgroundColor: `${accentColor}18` }}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />

          {/* Accent bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: accentColor }}
          />

          {/* Title over image */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:pb-10">
            <div className="mx-auto max-w-6xl">
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70 hover:bg-white/20 hover:text-white transition-colors backdrop-blur-sm"
              >
                ←
              </Link>
              <h1
                className="text-4xl font-bold leading-tight text-white md:text-5xl"
                style={TOMO}
              >
                {classData!.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          {/* ── Tags row ───────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 py-5">
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600">
              {weeksLabel}
            </span>
            {classData!.meeting_days && (
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600">
                {classData!.meeting_days}
              </span>
            )}
            {classData!.price && (
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-900">
                {classData!.price}
              </span>
            )}
          </div>

          {/* ── Two-column body ────────────────────────────────── */}
          <div className="pb-24 lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Left: main content */}
            <div className="space-y-10 lg:col-span-2">

              {/* Event info card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-xl mt-0.5" aria-hidden="true">📅</span>
                  <div>
                    <p className="font-semibold text-gray-900">{dateRange}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{weeksLabel}</p>
                  </div>
                </div>
                {(classData!.meeting_days || timeRange) && (
                  <>
                    <div className="h-px bg-gray-100" />
                    <div className="flex items-start gap-4">
                      <span className="text-xl mt-0.5" aria-hidden="true">🕒</span>
                      <div>
                        {classData!.meeting_days && (
                          <p className="font-semibold text-gray-900">{classData!.meeting_days}</p>
                        )}
                        <p className="mt-0.5 text-sm text-gray-500">
                          {timeRange}
                          {duration && ` · ${duration}`}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {classData!.location_details && (
                  <>
                    <div className="h-px bg-gray-100" />
                    <div className="flex items-start gap-4">
                      <span className="text-xl mt-0.5" aria-hidden="true">📍</span>
                      <p className="text-sm text-gray-600">{classData!.location_details}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              {classData!.description && (
                <section>
                  <h2 className="mb-4 text-2xl text-gray-900" style={TOMO}>
                    About this class
                  </h2>
                  <div className="space-y-4">
                    {classData!.description.split("\n\n").map((para, i) => (
                      <p key={i} className="text-base leading-relaxed text-gray-600">
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Host */}
              {classData!.host_blurb && (
                <section>
                  <h2 className="mb-4 text-2xl text-gray-900" style={TOMO}>
                    Meet your host
                  </h2>
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex gap-4">
                      <div
                        className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center text-white text-lg font-bold"
                        style={{ backgroundColor: accentColor }}
                        aria-hidden="true"
                      >
                        {classData!.title.charAt(0)}
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                        {classData!.host_blurb}
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right: sticky enrollment card (desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-gray-100 bg-white p-6 shadow-md space-y-5">
                <p className="text-lg leading-snug text-gray-900" style={TOMO}>
                  {classData!.title}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📅</span>
                    <span>{dateRange}</span>
                  </div>
                  {classData!.meeting_days && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🕒</span>
                      <span>
                        {classData!.meeting_days}
                        {timeRange && `, ${timeRange}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-100" />

                <div>
                  <p
                    className="mb-3 text-sm font-semibold"
                    style={{ color: isFull ? "#999" : accentColor }}
                  >
                    {spotsLabel}
                  </p>
                  <RegisterCTA
                    classId={id}
                    classTitle={classData!.title}
                    isFull={isFull}
                    isLoggedIn={isLoggedIn}
                    isRegistered={classData!.isRegistered}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile enrollment card */}
          <div className="lg:hidden pb-16">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
              <p
                className="mb-3 text-sm font-semibold"
                style={{ color: isFull ? "#999" : accentColor }}
              >
                {spotsLabel}
              </p>
              <RegisterCTA
                classId={id}
                classTitle={classData!.title}
                isFull={isFull}
                isLoggedIn={isLoggedIn}
                isRegistered={classData!.isRegistered}
              />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
