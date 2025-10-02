import { notFound } from "next/navigation";
import { formatDateRange, formatDuration, formatTimeRange } from "@/lib/format";
import { getClassById } from "@/lib/class-queries";
import { createClient } from "@/utils/supabase/server";
import { RegisterButton } from "./register-button";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { id } = await params;

  const classData = await getClassById(supabase, id, user.id);

  if (!classData) {
    notFound();
  }

  const dateRange = formatDateRange(classData.start_date, classData.end_date);
  const timeRange = formatTimeRange(classData.start_time, classData.end_time);
  const duration = formatDuration(classData.start_time, classData.end_time);
  const weeksLabel = `${classData.weeks} ${classData.weeks === 1 ? "week" : "weeks"}`;
  const spotsLabel = `${classData.spotsLeft} spot${classData.spotsLeft === 1 ? "" : "s"} left`;
  const requirements = classData.requirements ?? "Nothing special required.";

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {classData.level}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{classData.title}</h1>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          <span className="rounded-full bg-gray-200 px-3 py-1 font-medium">{weeksLabel}</span>
          <span className="rounded-full bg-gray-200 px-3 py-1 font-medium">{spotsLabel}</span>
          <span className="rounded-full bg-gray-200 px-3 py-1 font-medium">{classData.location_tag}</span>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Details</h2>
        <dl className="space-y-3 text-sm leading-6 text-gray-700">
          <div>
            <dt className="font-semibold text-gray-900">{classData.schedule_summary}:</dt>
            <dd>{dateRange}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">Time:</dt>
            <dd>
              {classData.meeting_days}, {timeRange} ({duration})
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">Location:</dt>
            <dd>{classData.location_details}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">You will need:</dt>
            <dd>{requirements}</dd>
          </div>
        </dl>
      </section>

      {classData.host_blurb ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Meet the host</h2>
          <p className="text-base leading-7 text-gray-700 whitespace-pre-line">
            {classData.host_blurb}
          </p>
        </section>
      ) : null}

      {classData.description ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">The class</h2>
          <p className="text-base leading-7 text-gray-700 whitespace-pre-line">
            {classData.description}
          </p>
        </section>
      ) : null}

      <RegisterButton
        classId={classData.id}
        isRegistered={classData.isRegistered}
        isFull={classData.spotsLeft === 0}
      />
    </div>
  );
}
