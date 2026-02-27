import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getPublicClasses } from "@/lib/class-queries";
import { MOCK_CLASSES, type ClassWithPrice } from "@/lib/mock-classes";
import { PublicClassCard } from "@/components/public-class-card";

const TOMO = { fontFamily: "var(--font-tomo-bossa)" };

export default async function BrowsePage() {
  let classes: ClassWithPrice[] = [];
  try {
    const supabase = await createClient();
    classes = (await getPublicClasses(supabase)) as ClassWithPrice[];
  } catch {
    // fall through to mock data
  }

  if (classes.length === 0) {
    classes = MOCK_CLASSES;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header — matches homepage style ───────────────── */}
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
            <span
              className="font-medium text-black text-sm md:text-[18px]"
              style={TOMO}
            >
              Classes
            </span>
            <Link
              href="/"
              className="cursor-pointer font-medium text-black hover:underline text-sm md:text-[18px]"
              style={TOMO}
            >
              Join the Club
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Page title ────────────────────────────────────── */}
      <section className="px-6 pb-4 pt-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h1
            className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl"
            style={TOMO}
          >
            All Classes.
          </h1>
          <p className="mt-4 max-w-xl text-base text-gray-500">
            Hands-on workshops and intimate classes led by passionate instructors across Los Angeles and online.
          </p>
          <p className="mt-3 text-sm text-gray-400">
            {classes.length} classes &bull; Spring 2026
          </p>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────────── */}
      <section className="px-6 py-10 md:px-12">
        <div className="mx-auto max-w-7xl">
          {classes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 px-8 py-24 text-center">
              <p className="text-3xl mb-3" aria-hidden="true">🌱</p>
              <p className="font-semibold text-gray-700">Classes coming soon</p>
              <p className="mt-1 text-sm text-gray-400">
                Check back soon — new classes are added regularly.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Join the waitlist
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls, i) => (
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
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer — matches homepage ──────────────────────── */}
      <footer className="mt-auto bg-white px-6 py-8 md:px-12">
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
