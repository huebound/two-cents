import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getClassById } from "@/lib/class-queries";
import type { ClassWithPrice } from "@/lib/class-queries";
import { formatDateRange, formatTimeRange } from "@/lib/format";
import { RegisterCTA } from "@/components/register-cta";
import { SiteNavbar } from "@/components/app-navbar";
import { SiteFooter } from "@/components/site-footer";
import { FEATURED_EVENT } from "@/lib/featured-event";
import { getUserFirstName } from "@/lib/user-queries";
import { TOMO } from "@/lib/constants";

const ACCENT_COLOR = "#C94256";

export default async function TinyTalksPage() {
  let classData: ClassWithPrice | null = null;
  let isLoggedIn = false;
  let firstName: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
    if (user) {
      firstName = await getUserFirstName(supabase, user);
    }
    classData = (await getClassById(supabase, FEATURED_EVENT.id, user?.id)) as ClassWithPrice | null;
  } catch {
    // fall through to notFound
  }

  if (!classData) notFound();

  const dateRange = formatDateRange(classData!.start_date, classData!.end_date);
  const timeRange = formatTimeRange(classData!.start_time, classData!.end_time);
  const isFull = classData!.spotsLeft === 0;

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
              style={{ backgroundColor: `${ACCENT_COLOR}18` }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: ACCENT_COLOR }} />

          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:pb-10">
            <div className="mx-auto max-w-5xl">
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-s font-medium text-white/70 hover:bg-white/20 hover:text-white transition-colors backdrop-blur-sm"
              >
                ←
              </Link>
              <h1 className="text-4xl leading-tight text-white md:text-5xl" style={TOMO}>
                {classData!.title}
              </h1>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-6">
          <div className="py-10 lg:grid lg:grid-cols-3 lg:gap-16">

            {/* Main content */}
            <div className="lg:col-span-2">

              {/* Event details — clean rows, no card */}
              <div className="mb-8 space-y-3 border-b border-gray-100 pb-8">
                <div className="flex items-baseline gap-4">
                  <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-gray-400">Date</span>
                  <span className="text-base text-gray-900">{dateRange}</span>
                </div>
                {timeRange && (
                  <div className="flex items-baseline gap-4">
                    <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-gray-400">Time</span>
                    <span className="text-base text-gray-900">
                      {timeRange}
                    </span>
                  </div>
                )}
                {classData!.location_details && (
                  <div className="flex items-baseline gap-4">
                    <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-gray-400">Where</span>
                    <span className="text-base text-gray-900">{classData!.location_details}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {classData!.description && (
                <section className="space-y-4">
                    {classData!.description.split("\n\n").map((para, i) => (
                      <p key={i} className="leading-relaxed text-black">
                        {para}
                      </p>
                    ))}
                </section>
              )}

              {/* Mobile CTA */}
              <div className="mt-10 lg:hidden">
                <RegisterCTA
                  classId={FEATURED_EVENT.id}
                  classTitle={classData!.title}
                  isFull={isFull}
                  isLoggedIn={isLoggedIn}
                  isRegistered={classData!.isRegistered}
                />
              </div>
            </div>

            {/* Desktop sidebar — no card, just sticky CTA */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-3">
                <RegisterCTA
                  classId={FEATURED_EVENT.id}
                  classTitle={classData!.title}
                  isFull={isFull}
                  isLoggedIn={isLoggedIn}
                  isRegistered={classData!.isRegistered}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
