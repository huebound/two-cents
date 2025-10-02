import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate, formatTimeRange } from "@/lib/format";

type ClassCardProps = {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endTime: string;
  meetingDays: string;
  level: string;
  locationTag: string;
  spotsLeft?: number;
  className?: string;
};

export function ClassCard({
  id,
  title,
  startDate,
  startTime,
  endTime,
  meetingDays,
  level,
  locationTag,
  spotsLeft,
  className,
}: ClassCardProps) {
  return (
    <Link
      href={`/classes/${id}`}
      className={cn(
        "flex w-64 shrink-0 snap-start flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {level} • {locationTag}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="text-sm text-gray-600">
        <div>{meetingDays}</div>
        <div>{formatDate(startDate)}</div>
        <div>{formatTimeRange(startTime, endTime)}</div>
      </div>
      {typeof spotsLeft === "number" ? (
        <div className="text-sm font-medium text-gray-900">
          {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left
        </div>
      ) : null}
    </Link>
  );
}

export default ClassCard;
