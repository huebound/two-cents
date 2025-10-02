"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { formatDate, formatDateRange, formatTimeRange } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateClassDetailsAction, type UpdateClassFormState } from "./update-class-action";

const INITIAL_UPDATE_STATE: UpdateClassFormState = { status: "idle" };

type UpcomingSession = {
  sessionId: string;
  classId: string;
  title: string;
  level: string;
  locationTag: string;
  meetingDays: string;
  startTime: string;
  endTime: string;
  sessionIndex: number;
  totalOccurrences: number;
  spotsLeft: number;
  sessionDate: string;
};

type AttendedHistoryItem = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "Completed" | "In Progress";
};

type TeachingActiveClass = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  level: string;
  locationTag: string;
  scheduleSummary: string;
  meetingDays: string;
  locationDetails: string;
  requirements: string;
  description: string;
  hostBlurb: string;
  spotsLeft: number;
  totalSpots: number;
};

type TeachingPastClass = {
  id: string;
  title: string;
  dateRange: string;
};

type TabKey = "upcoming" | "teaching" | "attended";

type ClassesTabsProps = {
  upcomingSessions: UpcomingSession[];
  attendedHistory: AttendedHistoryItem[];
  teachingActive: TeachingActiveClass[];
  teachingPast: TeachingPastClass[];
  counts: Record<TabKey, number>;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "teaching", label: "Teaching" },
  { key: "attended", label: "Attended" },
];

function UpcomingTab({ sessions }: { sessions: UpcomingSession[] }) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No upcoming sessions yet. Register for a class and your schedule will show up here.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sessions.map((session) => (
        <Link
          key={session.sessionId}
          href={`/classes/${session.classId}`}
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span>
              {session.level} • {session.locationTag}
            </span>
            <span>
              Session {session.sessionIndex} of {session.totalOccurrences}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
          <p className="text-sm text-gray-600">
            {formatDate(session.sessionDate)} • {formatTimeRange(session.startTime, session.endTime)}
          </p>
          <p className="text-sm text-gray-600">{session.meetingDays}</p>
          <p className="text-sm font-medium text-gray-900">
            {session.spotsLeft} spot{session.spotsLeft === 1 ? "" : "s"} left
          </p>
        </Link>
      ))}
    </div>
  );
}

function AttendedTab({ history }: { history: AttendedHistoryItem[] }) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Classes you&apos;ve taken will appear here once they begin.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left font-semibold text-gray-600">
          <tr>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Dates</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {history.map((item) => (
            <tr key={item.id} className="text-gray-700">
              <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
              <td className="px-4 py-3 text-gray-600">
                {formatDateRange(item.startDate, item.endDate)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === "Completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeachingActiveList({ classes }: { classes: TeachingActiveClass[] }) {
  if (classes.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        When you publish a class, you&apos;ll manage it here.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {classes.map((classItem) => (
        <TeachingEditor key={classItem.id} classItem={classItem} />
      ))}
    </div>
  );
}

function TeachingPastList({ classes }: { classes: TeachingPastClass[] }) {
  if (classes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Past courses</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        {classes.map((classItem) => (
          <li key={classItem.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2">
            <span className="font-medium text-gray-900">{classItem.title}</span>
            <span>{classItem.dateRange}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeachingTab({
  active,
  past,
}: {
  active: TeachingActiveClass[];
  past: TeachingPastClass[];
}) {
  return (
    <div className="space-y-8">
      <TeachingActiveList classes={active} />
      <TeachingPastList classes={past} />
    </div>
  );
}

function TeachingEditor({ classItem }: { classItem: TeachingActiveClass }) {
  const [state, formAction, isPending] = useActionState(
    updateClassDetailsAction,
    INITIAL_UPDATE_STATE,
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-900">{classItem.title}</h2>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {classItem.level} • {classItem.locationTag}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {formatDateRange(classItem.startDate, classItem.endDate)} • {classItem.meetingDays}
        </p>
        <p className="text-sm text-gray-600">
          {classItem.scheduleSummary} • {classItem.totalSpots - classItem.spotsLeft} / {classItem.totalSpots} seats filled
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="classId" value={classItem.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Schedule label
            <Input name="scheduleSummary" defaultValue={classItem.scheduleSummary} required />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Meeting days
            <Input name="meetingDays" defaultValue={classItem.meetingDays} required />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Location details
          <Input name="locationDetails" defaultValue={classItem.locationDetails} required />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          What learners should bring
          <Input name="requirements" defaultValue={classItem.requirements} placeholder="Optional" />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Host introduction
          <textarea
            name="hostBlurb"
            defaultValue={classItem.hostBlurb}
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Class description
          <textarea
            name="description"
            defaultValue={classItem.description}
            rows={4}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            required
          />
        </label>

        {state.status === "error" ? (
          <p className="text-sm text-red-600">{state.message}</p>
        ) : null}
                <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
          {isPending ? null : state.status === "success" ? (
            <span className="text-sm text-emerald-600">Saved.</span>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default function ClassesTabs({
  upcomingSessions,
  attendedHistory,
  teachingActive,
  teachingPast,
  counts,
}: ClassesTabsProps) {
  const initialTab: TabKey = upcomingSessions.length > 0
    ? "upcoming"
    : teachingActive.length > 0 || teachingPast.length > 0
      ? "teaching"
      : attendedHistory.length > 0
        ? "attended"
        : "upcoming";

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Your Classes</h1>
        <p className="text-sm text-gray-600">
          Track the sessions you&apos;re attending, revisit past classes, and manage everything you teach.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const count = counts[tab.key];
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              <span>{tab.label}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {activeTab === "upcoming" ? <UpcomingTab sessions={upcomingSessions} /> : null}
        {activeTab === "teaching" ? (
          <TeachingTab active={teachingActive} past={teachingPast} />
        ) : null}
        {activeTab === "attended" ? <AttendedTab history={attendedHistory} /> : null}
      </div>
    </div>
  );
}
