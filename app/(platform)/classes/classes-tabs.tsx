"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { formatDateRange, formatTimeRange } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateClassDetailsAction, type UpdateClassFormState } from "./update-class-action";
import { deleteClassAction, type DeleteClassState } from "./delete-class-action";
import { TOMO } from "@/lib/constants";
import { EmptyState } from "@/components/empty-state";

const INITIAL_UPDATE_STATE: UpdateClassFormState = { status: "idle" };
const INITIAL_DELETE_STATE: DeleteClassState = { status: "idle" };

type UpcomingSession = {
  sessionId: string;
  classId: string;
  title: string;
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
  meetingDays: string;
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

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "upcoming",  label: "Attending", icon: "📋" },
  { key: "teaching",  label: "Teaching",  icon: "🍎" },
  { key: "attended",  label: "Completed", icon: "📚" },
];

// ── Date block ────────────────────────────────────────────────────────────────
function SessionDateBlock({ isoDate }: { isoDate: string }) {
  const date = new Date(isoDate + "T00:00:00");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();
  return (
    <div className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#C94256]/8 py-2">
      <span className="text-[9px] font-bold uppercase tracking-widest text-[#C94256]">{month}</span>
      <span className="text-xl font-bold leading-tight text-gray-900">{day}</span>
    </div>
  );
}

// ── Upcoming tab ─────────────────────────────────────────────────────────────
function UpcomingTab({ sessions }: { sessions: UpcomingSession[] }) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        emoji="🗓️"
        title="Nothing on the schedule yet"
        description="Register for a class and your sessions will appear here."
        action={{ href: "/discover", label: "Browse classes" }}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {sessions.map((session) => (
        <Link
          key={session.sessionId}
          href={`/classes/${session.classId}`}
          className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <SessionDateBlock isoDate={session.sessionDate} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">{session.title}</p>
            <p className="mt-0.5 text-sm text-gray-500">
              {formatTimeRange(session.startTime, session.endTime)}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              Session {session.sessionIndex} of {session.totalOccurrences}
            </p>
          </div>
          {session.spotsLeft != null && (
            <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              {session.spotsLeft} left
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

// ── Attended tab ─────────────────────────────────────────────────────────────
function AttendedTab({ history }: { history: AttendedHistoryItem[] }) {
  if (history.length === 0) {
    return (
      <EmptyState
        emoji="📖"
        title="Your transcript is empty for now"
        description="Classes you've finished will appear here."
      />
    );
  }

  return (
    <div className="space-y-2">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4"
        >
          <div>
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="mt-0.5 text-sm text-gray-500">
              {formatDateRange(item.startDate, item.endDate)}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              item.status === "Completed"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Teaching tab ─────────────────────────────────────────────────────────────
function TeachingTab({
  active,
  past,
}: {
  active: TeachingActiveClass[];
  past: TeachingPastClass[];
}) {
  if (active.length === 0 && past.length === 0) {
    return (
      <EmptyState
        emoji="🍎"
        title="Nothing to manage yet"
        description="When you publish a class, it will appear here."
        action={{ href: "/teach", label: "Create a class", variant: "red" }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {active.map((cls) => (
        <TeachingEditor key={cls.id} classItem={cls} />
      ))}

      {past.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Past courses
          </h3>
          <ul className="space-y-2">
            {past.map((cls) => (
              <li
                key={cls.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-3 text-sm"
              >
                <span className="font-medium text-gray-900">{cls.title}</span>
                <span className="text-gray-500">{cls.dateRange}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Teaching editor ───────────────────────────────────────────────────────────
function TeachingEditor({ classItem }: { classItem: TeachingActiveClass }) {
  const [state, formAction, isPending] = useActionState(
    updateClassDetailsAction,
    INITIAL_UPDATE_STATE,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteClassAction,
    INITIAL_DELETE_STATE,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const enrolledCount = classItem.totalSpots - classItem.spotsLeft;
  const capacityLabel = classItem.totalSpots
    ? `${enrolledCount} / ${classItem.totalSpots} enrolled`
    : `${enrolledCount} enrolled`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
      {/* Class meta */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900" style={TOMO}>
            {classItem.title}
          </h2>
          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Active
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {formatDateRange(classItem.startDate, classItem.endDate)}
          {classItem.meetingDays ? ` · ${classItem.meetingDays}` : ""}
        </p>
        <p className="mt-0.5 text-sm font-medium text-gray-700">{capacityLabel}</p>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Edit form */}
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="classId" value={classItem.id} />

        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
          Meeting days
          <Input name="meetingDays" defaultValue={classItem.meetingDays} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
          Host introduction
          <textarea
            name="hostBlurb"
            defaultValue={classItem.hostBlurb}
            rows={3}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm shadow-sm focus:border-[#C94256] focus:outline-none focus:ring-2 focus:ring-[#C94256]/20 transition resize-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-700">
          Class description
          <textarea
            name="description"
            defaultValue={classItem.description}
            rows={4}
            required
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm shadow-sm focus:border-[#C94256] focus:outline-none focus:ring-2 focus:ring-[#C94256]/20 transition resize-none"
          />
        </label>

        {state.status === "error" && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending || isDeleting}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
            {!isPending && state.status === "success" && (
              <span className="text-sm text-emerald-600">Saved ✓</span>
            )}
          </div>

          {!showDeleteConfirm && (
            <Button
              type="button"
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isPending || isDeleting}
            >
              Delete class
            </Button>
          )}
        </div>
      </form>

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="mb-3 text-sm font-medium text-red-900">
            Delete this class? This action cannot be undone.
          </p>
          <form action={deleteAction} className="flex items-center gap-3">
            <input type="hidden" name="classId" value={classItem.id} />
            <Button type="submit" variant="destructive" disabled={isDeleting}>
              {isDeleting ? "Deleting…" : "Yes, delete"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </form>
          {deleteState.status === "error" && (
            <p className="mt-2 text-sm text-red-600">{deleteState.message}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────
export default function ClassesTabs({
  upcomingSessions,
  attendedHistory,
  teachingActive,
  teachingPast,
  counts,
}: ClassesTabsProps) {
  const initialTab: TabKey =
    upcomingSessions.length > 0
      ? "upcoming"
      : teachingActive.length > 0 || teachingPast.length > 0
        ? "teaching"
        : "upcoming";

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  return (
    <div className="space-y-7">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900" style={TOMO}>
          My Classes
        </h1>
        <p className="text-sm text-gray-500">
          Your schedule, history, and everything you teach.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count = counts[tab.key];
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "border-black bg-black text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Teach CTA */}
        <Link
          href="/teach"
          className="ml-auto flex items-center gap-1.5 rounded-full bg-[#C94256] px-4 py-2 text-sm font-medium text-white hover:bg-[#a33045] transition-colors"
        >
          + New class
        </Link>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "upcoming" && <UpcomingTab sessions={upcomingSessions} />}
        {activeTab === "teaching" && (
          <TeachingTab active={teachingActive} past={teachingPast} />
        )}
        {activeTab === "attended" && <AttendedTab history={attendedHistory} />}
      </div>
    </div>
  );
}
