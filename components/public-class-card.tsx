import Link from "next/link";
import { formatDate, formatTimeRange } from "@/lib/format";
import { cn } from "@/lib/utils";

const ACCENT_COLORS = ["#C94256", "#4A90E2", "#4A9B8E", "#D97706"];

type PublicClassCardProps = {
  id: string;
  title: string;
  imageUrl?: string | null;
  startDate: string;
  startTime: string;
  endTime: string;
  meetingDays: string;
  level: string;
  locationTag: string;
  spotsLeft?: number;
  price?: string;
  accentIndex?: number;
  featured?: boolean;
  className?: string;
};

export function PublicClassCard({
  id,
  title,
  imageUrl,
  startDate,
  startTime,
  endTime,
  meetingDays,
  level,
  locationTag,
  spotsLeft,
  price,
  accentIndex = 0,
  featured = false,
  className,
}: PublicClassCardProps) {
  const accentColor = ACCENT_COLORS[accentIndex % ACCENT_COLORS.length];

  if (featured) {
    return (
      <Link
        href={`/c/${id}`}
        className={cn(
          "group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
          className
        )}
      >
        <div
          className="h-1.5 w-full shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-52 w-full object-cover"
          />
        ) : (
          <div
            className="h-52 w-full"
            style={{ backgroundColor: `${accentColor}18` }}
          />
        )}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {level} &bull; {locationTag}
          </p>
          <h3
            className="text-xl font-semibold leading-snug text-gray-900 group-hover:text-black"
            style={{ fontFamily: "var(--font-neue-montreal)" }}
          >
            {title}
          </h3>
          <div className="mt-auto space-y-1 text-sm text-gray-500">
            <p>{meetingDays}</p>
            <p>Starts {formatDate(startDate)}</p>
            <p>{formatTimeRange(startTime, endTime)}</p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            {price && (
              <span className="text-sm font-semibold text-gray-900">{price}</span>
            )}
            {typeof spotsLeft === "number" && spotsLeft <= 5 && (
              <span
                className="text-xs font-semibold ml-auto"
                style={{ color: accentColor }}
              >
                {spotsLeft === 0
                  ? "Fully booked"
                  : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/c/${id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div
          className="h-40 w-full"
          style={{ backgroundColor: `${accentColor}18` }}
        />
      )}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {level} &bull; {locationTag}
        </p>
        <h3 className="text-base font-semibold leading-snug text-gray-900 group-hover:text-black">
          {title}
        </h3>
        <div className="text-sm text-gray-500">
          <p>{meetingDays}</p>
          <p>{formatDate(startDate)}</p>
          <p>{formatTimeRange(startTime, endTime)}</p>
        </div>
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {price && (
            <span className="text-sm font-semibold text-gray-900">{price}</span>
          )}
          {typeof spotsLeft === "number" && spotsLeft <= 5 && (
            <span
              className="text-xs font-semibold ml-auto"
              style={{ color: accentColor }}
            >
              {spotsLeft === 0
                ? "Fully booked"
                : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
