import { notFound } from "next/navigation";
import { formatDateRange, formatDuration, formatTimeRange } from "@/lib/format";
import { getClassById } from "@/lib/class-queries";
import { createClient } from "@/utils/supabase/server";
import { RegisterButton } from "./register-button";
import { TOMO } from "@/lib/constants";

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

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-16">

      {/* Hero */}
      <div className="space-y-4">
        <h1
          className="text-4xl leading-tight text-gray-900"
          style={TOMO}
        >
          {classData.title}
        </h1>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
            {weeksLabel}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
            {spotsLabel}
          </span>
        </div>
      </div>

      {/* Event info — Partiful-style */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-xl leading-none mt-0.5">📅</span>
          <div>
            <p className="font-semibold text-gray-900">{dateRange}</p>
            <p className="text-sm text-gray-500">{weeksLabel}</p>
          </div>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex items-start gap-3">
          <span className="text-xl leading-none mt-0.5">🕒</span>
          <div>
            <p className="font-semibold text-gray-900">{classData.meeting_days}</p>
            <p className="text-sm text-gray-500">
              {timeRange} · {duration}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {classData.description ? (
        <section className="space-y-3">
          <h2
            className="text-xl text-gray-900"
            style={TOMO}
          >
            About this class
          </h2>
          <p className="text-base leading-7 text-gray-700 whitespace-pre-line">
            {classData.description}
          </p>
        </section>
      ) : null}

      {/* Host */}
      {classData.host_blurb ? (
        <section className="space-y-3">
          <h2
            className="text-xl text-gray-900"
            style={TOMO}
          >
            Meet your host
          </h2>
          <p className="text-base leading-7 text-gray-700 whitespace-pre-line">
            {classData.host_blurb}
          </p>
        </section>
      ) : null}

      {/* Register CTA */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm text-gray-500">Spots are limited. Register to save yours.</p>
        <RegisterButton
          classId={classData.id}
          isRegistered={classData.isRegistered}
          isFull={classData.spotsLeft === 0}
        />
      </div>
    </div>
  );
}
