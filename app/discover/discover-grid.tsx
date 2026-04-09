import Link from "next/link";
import type { ClassWithMeta } from "@/lib/class-queries";
import { PublicClassCard } from "@/components/public-class-card";
import { FEATURED_EVENT } from "@/lib/featured-event";
import { TOMO } from "@/lib/constants";

type Props = {
  classes: ClassWithMeta[];
};

export function DiscoverGrid({ classes }: Props) {
  if (classes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 px-8 py-24 text-center">
        <p className="text-4xl mb-3">🌱</p>
        <p className="font-semibold text-gray-700" style={TOMO}>
          Classes coming soon
        </p>
        <p className="mt-1 text-sm text-gray-400">
          New classes are added regularly — check back soon.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Join the waitlist
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((cls, i) => (
        <PublicClassCard
          key={cls.id}
          id={cls.id}
          href={cls.id === FEATURED_EVENT.id ? FEATURED_EVENT.path : undefined}
          title={cls.title}
          imageUrl={cls.image_url ?? undefined}
          startDate={cls.start_date}
          startTime={cls.start_time}
          endTime={cls.end_time}
          meetingDays={cls.meeting_days}
          spotsLeft={cls.spotsLeft ?? undefined}
          accentIndex={i}
          featured
        />
      ))}
    </div>
  );
}
