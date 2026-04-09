import { createClient } from "@/utils/supabase/server";
import { getPublicClasses } from "@/lib/class-queries";
import type { ClassWithMeta } from "@/lib/class-queries";
import { SiteNavbar } from "@/components/app-navbar";
import { SiteFooter } from "@/components/site-footer";
import { DiscoverGrid } from "./discover-grid";
import { getUserFirstName } from "@/lib/user-queries";
import { TOMO } from "@/lib/constants";

export default async function DiscoverPage() {
  let classes: ClassWithMeta[] = [];
  let isLoggedIn = false;
  let firstName: string | undefined;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
    firstName = user ? await getUserFirstName(supabase, user) : undefined;
    classes = await getPublicClasses(supabase);
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar isLoggedIn={isLoggedIn} firstName={firstName} />

      {/* ── Page header ────────────────────────────────────── */}
      <section className="bg-white px-6 pt-10 pb-2">
        <div className="mx-auto max-w-6xl">
          <h1
            className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl tracking-[0.04em]"
            style={TOMO}
          >
            Discover Classes
          </h1>
          <p className="mt-3 max-w-xl text-base text-gray-500">
            Take hands-on workshops and intimate courses led by passionate instructors.
          </p>
        </div>
      </section>

      {/* ── Grid + filters ─────────────────────────────────── */}
      <section className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <DiscoverGrid classes={classes} />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
