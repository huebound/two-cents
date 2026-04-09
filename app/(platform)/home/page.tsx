import Link from "next/link";
import { ClassCard } from "@/components/class-card";
import { getDtlaClasses, getRecentClasses, getUpcomingClasses } from "@/lib/class-queries";
import { createClient } from "@/utils/supabase/server";
import { getUserFirstName } from "@/lib/user-queries";
import { TOMO } from "@/lib/constants";
import { EmptyState } from "@/components/empty-state";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [firstName, upcomingClasses, exploreClasses, recentClasses] = await Promise.all([
    getUserFirstName(supabase, user).then((n) => n ?? user.email?.split("@")[0] ?? "Friend"),
    getUpcomingClasses(supabase, user.id).catch(() => []),
    getDtlaClasses(supabase, user.id).catch(() => []),
    getRecentClasses(supabase, user.id).catch(() => []),
  ]);

  const upcomingCount = upcomingClasses.length;

  return (
    <div className="space-y-10">

      {/* ── Greeting ────────────────────────────────────── */}
      <section className="rounded-2xl bg-gray-900 px-6 py-7 md:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-white/40 mb-1">
          Welcome back
        </p>
        <h1 className="text-3xl font-bold text-white" style={TOMO}>
          Hey, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-white/60">
          {upcomingCount > 0
            ? `You have ${upcomingCount} upcoming ${upcomingCount === 1 ? "class" : "classes"} on your schedule.`
            : "Your schedule is clear — time to find something new."}
        </p>
        {upcomingCount === 0 && (
          <Link
            href="/discover"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#F6DE27] px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300 transition-colors"
            style={TOMO}
          >
            Discover classes →
          </Link>
        )}
      </section>

      {/* ── Upcoming classes ────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-gray-900" style={TOMO}>
            Upcoming Classes
          </h2>
          <Link
            href="/classes"
            className="text-xs font-medium text-gray-400 hover:text-black transition-colors"
          >
            View all →
          </Link>
        </div>

        {upcomingClasses.length > 0 ? (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {upcomingClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                id={cls.id}
                title={cls.title}
                imageUrl={cls.image_url ?? undefined}
                startDate={cls.start_date}
                startTime={cls.start_time}
                endTime={cls.end_time}
                meetingDays={cls.meeting_days ?? undefined}
                spotsLeft={cls.spotsLeft ?? undefined}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🗓️"
            title="Nothing on the schedule yet"
            description="Register for a class and it will show up here."
            action={{ href: "/discover", label: "Browse classes" }}
          />
        )}
      </section>

      {/* ── Explore more ────────────────────────────────── */}
      {exploreClasses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-gray-900" style={TOMO}>
              Explore More
            </h2>
            <Link
              href="/discover"
              className="text-xs font-medium text-gray-400 hover:text-black transition-colors"
            >
              See all →
            </Link>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {exploreClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                id={cls.id}
                title={cls.title}
                imageUrl={cls.image_url ?? undefined}
                startDate={cls.start_date}
                startTime={cls.start_time}
                endTime={cls.end_time}
                meetingDays={cls.meeting_days ?? undefined}
                spotsLeft={cls.spotsLeft ?? undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Past classes ────────────────────────────────── */}
      {recentClasses.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900" style={TOMO}>
            Recently Attended
          </h2>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {recentClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                id={cls.id}
                title={cls.title}
                imageUrl={cls.image_url ?? undefined}
                startDate={cls.start_date}
                startTime={cls.start_time}
                endTime={cls.end_time}
                meetingDays={cls.meeting_days ?? undefined}
                spotsLeft={cls.spotsLeft ?? undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Teach CTA ───────────────────────────────────── */}
      <section className="rounded-2xl border border-dashed border-gray-200 px-6 py-8 text-center">
        <p className="text-2xl mb-2" aria-hidden="true">🍎</p>
        <h3 className="text-lg font-semibold text-gray-900" style={TOMO}>
          Ready to share what you know?
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Create a class and teach the Two Cents Club community.
        </p>
        <Link
          href="/teach"
          className="mt-4 inline-flex rounded-full bg-[#C94256] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a33045] transition-colors"
        >
          Create a class →
        </Link>
      </section>
    </div>
  );
}
