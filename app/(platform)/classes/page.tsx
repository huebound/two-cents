import { createClient } from "@/utils/supabase/server";
import {
  getAttendedClasses,
  getClassProgress,
  getTeachingClasses,
  getUpcomingClasses,
  getUpcomingSessionDates,
} from "@/lib/class-queries";
import { formatDateRange } from "@/lib/format";
import ClassesTabs from "./classes-tabs";

function toIsoDateString(date: Date) {
  return date.toISOString().split("T")[0];
}

export default async function ClassesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [upcomingClasses, attendedClasses, teachingClasses] = await Promise.all([
    getUpcomingClasses(supabase, user.id),
    getAttendedClasses(supabase, user.id),
    getTeachingClasses(supabase, user.id),
  ]);

  const upcomingSessions = upcomingClasses
    .map((classItem) => {
      const progress = getClassProgress(classItem);
      const sessionDates = getUpcomingSessionDates(classItem);
      return {
        classItem,
        progress,
        sessionDates,
      };
    })
    .filter((entry) => entry.progress.remainingOccurrences > 0)
    .flatMap((entry) => {
      const startOffset = entry.progress.totalOccurrences - entry.progress.remainingOccurrences;

      return entry.sessionDates.map((sessionDate, index) => ({
        sessionId: `${entry.classItem.id}-${sessionDate.toISOString()}`,
        classId: entry.classItem.id,
        title: entry.classItem.title,
        level: entry.classItem.level,
        locationTag: entry.classItem.location_tag,
        meetingDays: entry.classItem.meeting_days,
        startTime: entry.classItem.start_time,
        endTime: entry.classItem.end_time,
        sessionIndex: startOffset + index + 1,
        totalOccurrences: entry.progress.totalOccurrences,
        spotsLeft: entry.classItem.spotsLeft,
        sessionDate: toIsoDateString(sessionDate),
      }));
    });

  const attendedHistory = attendedClasses.map((classItem) => {
    const progress = getClassProgress(classItem);
    const status: "Completed" | "In Progress" = progress.status === "completed" ? "Completed" : "In Progress";

    return {
      id: classItem.id,
      title: classItem.title,
      startDate: classItem.start_date,
      endDate: classItem.end_date,
      status,
    };
  });

  const todayIso = new Date().toISOString().split("T")[0];
  const teachingActive = teachingClasses
    .filter((classItem) => classItem.end_date >= todayIso)
    .map((classItem) => ({
      id: classItem.id,
      title: classItem.title,
      startDate: classItem.start_date,
      endDate: classItem.end_date,
      level: classItem.level,
      locationTag: classItem.location_tag,
      scheduleSummary: classItem.schedule_summary,
      meetingDays: classItem.meeting_days,
      locationDetails: classItem.location_details,
      requirements: classItem.requirements ?? "",
      description: classItem.description ?? "",
      hostBlurb: classItem.host_blurb ?? "",
      spotsLeft: classItem.spotsLeft,
      totalSpots: classItem.total_spots,
    }));

  const teachingPast = teachingClasses
    .filter((classItem) => classItem.end_date < todayIso)
    .map((classItem) => ({
      id: classItem.id,
      title: classItem.title,
      dateRange: formatDateRange(classItem.start_date, classItem.end_date),
    }));

  return (
    <ClassesTabs
      upcomingSessions={upcomingSessions}
      attendedHistory={attendedHistory}
      teachingActive={teachingActive}
      teachingPast={teachingPast}
      counts={{
        upcoming: upcomingClasses.length,
        attended: attendedHistory.length,
        teaching: teachingClasses.length,
      }}
    />
  );
}
