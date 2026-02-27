import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getPublicClasses } from "@/lib/class-queries";
import { MOCK_CLASSES, type ClassWithPrice } from "@/lib/mock-classes";
import { HomepageLanding } from "@/components/homepage-landing";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (user.user_metadata?.onboarded) {
      redirect("/home");
    } else {
      redirect("/onboarding");
    }
  }

  let classes: ClassWithPrice[] = [];
  try {
    classes = await getPublicClasses(supabase) as ClassWithPrice[];
  } catch {
    // swallow DB errors — fall through to mock data
  }

  if (classes.length === 0) {
    classes = MOCK_CLASSES;
  }

  return <HomepageLanding classes={classes} />;
}
