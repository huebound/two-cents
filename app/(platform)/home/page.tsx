import { ClassCard } from "@/components/class-card";
import { getDtlaClasses, getRecentClasses, getUpcomingClasses } from "@/lib/class-queries";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .maybeSingle();

  const [upcomingClasses, dtlaClasses, recentClasses] = await Promise.all([
    getUpcomingClasses(supabase, user.id),
    getDtlaClasses(supabase, user.id),
    getRecentClasses(supabase, user.id),
  ]);

  const profileFirstName =
    typeof (profile as { first_name: string | null } | null)?.first_name === "string" && profile && (profile as { first_name: string | null }).first_name && (profile as { first_name: string }).first_name.trim().length > 0
      ? (profile as { first_name: string }).first_name.trim()
      : undefined;
  const metadataFirstName =
    typeof user.user_metadata?.first_name === "string" && user.user_metadata.first_name.trim().length > 0
      ? user.user_metadata.first_name.trim()
      : undefined;
  const firstName = profileFirstName ?? metadataFirstName ?? user.email?.split("@")[0] ?? "Friend";

  const upcomingCount = upcomingClasses.length;

  const sections = [
    {
      title: "Upcoming Classes",
      classes: upcomingClasses,
      emptyState: "No upcoming classes yet. Explore something new to add to your calendar.",
    },
    {
      title: "Coming up in DTLA",
      classes: dtlaClasses,
      emptyState: "No DTLA classes are scheduled right now. Check back soon!",
    },
    {
      title: "Recent Classes you took",
      classes: recentClasses,
      emptyState: "Once you finish a class it will show up here.",
    },
  ];

  return (
    <div className="space-y-12">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">
          {firstName}, you have {upcomingCount} {upcomingCount === 1 ? "class" : "classes"} coming up!
        </h1>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>

          {section.classes.length > 0 ? (
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {section.classes.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  id={classItem.id}
                  title={classItem.title}
                  imageUrl={classItem.image_url}
                  startDate={classItem.start_date}
                  startTime={classItem.start_time}
                  endTime={classItem.end_time}
                  meetingDays={classItem.meeting_days}
                  level={classItem.level}
                  locationTag={classItem.location_tag}
                  spotsLeft={classItem.spotsLeft}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{section.emptyState}</p>
          )}
        </section>
      ))}
    </div>
  );
}
