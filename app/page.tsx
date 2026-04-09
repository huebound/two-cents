import { createClient } from "@/utils/supabase/server";
import { HomepageLanding } from "@/components/homepage-landing";
import { getUserFirstName } from "@/lib/user-queries";
import { getClassById } from "@/lib/class-queries";
import { FEATURED_EVENT } from "@/lib/featured-event";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user ? await getUserFirstName(supabase, user) : undefined;
  const featuredEvent = await getClassById(supabase, FEATURED_EVENT.id).catch(() => null);

  return (
    <HomepageLanding
      isLoggedIn={!!user}
      firstName={firstName}
      featuredEvent={featuredEvent}
    />
  );
}
