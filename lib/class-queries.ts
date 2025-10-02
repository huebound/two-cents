import type { SupabaseClient } from "@supabase/supabase-js";

const CLASS_SELECT_BASE = `
  id,
  host_id,
  title,
  image_url,
  level,
  weeks,
  total_spots,
  start_date,
  end_date,
  start_time,
  end_time,
  meeting_days,
  schedule_summary,
  location_tag,
  location_details,
  requirements,
  host_blurb,
  description,
  created_at,
  class_registrations (id, user_id)
`;

const CLASS_SELECT_WITH_JOIN = `
  id,
  host_id,
  title,
  image_url,
  level,
  weeks,
  total_spots,
  start_date,
  end_date,
  start_time,
  end_time,
  meeting_days,
  schedule_summary,
  location_tag,
  location_details,
  requirements,
  host_blurb,
  description,
  created_at,
  class_registrations!inner (id, user_id)
`;

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;

function parseDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export type ClassProgressStatus = 'upcoming' | 'in_progress' | 'completed';

export type ClassProgress = {
  totalOccurrences: number;
  completedOccurrences: number;
  remainingOccurrences: number;
  status: ClassProgressStatus;
};

export function getClassProgress(
  record: ClassRecord,
  referenceDate: Date = new Date()
): ClassProgress {
  const totalOccurrences = Math.max(record.weeks, 1);
  const today = startOfDay(referenceDate);
  const startDate = parseDate(record.start_date);
  const endDate = parseDate(record.end_date);
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const todayMs = today.getTime();

  let status: ClassProgressStatus;
  if (endMs < todayMs) {
    status = 'completed';
  } else if (startMs > todayMs) {
    status = 'upcoming';
  } else {
    status = 'in_progress';
  }

  let completedOccurrences = 0;
  if (status === 'completed') {
    completedOccurrences = totalOccurrences;
  } else if (status === 'in_progress') {
    const elapsed = Math.max(0, todayMs - startMs);
    completedOccurrences = Math.min(
      totalOccurrences,
      Math.floor(elapsed / MS_PER_WEEK) + 1
    );
  }

  const remainingOccurrences = Math.max(totalOccurrences - completedOccurrences, 0);

  if (status === 'upcoming') {
    return {
      totalOccurrences,
      completedOccurrences: 0,
      remainingOccurrences: totalOccurrences,
      status,
    };
  }

  if (status === 'completed') {
    return {
      totalOccurrences,
      completedOccurrences: totalOccurrences,
      remainingOccurrences: 0,
      status,
    };
  }

  return {
    totalOccurrences,
    completedOccurrences,
    remainingOccurrences,
    status,
  };
}

type Supabase = SupabaseClient;

export type ClassRecord = {
  id: string;
  host_id: string | null;
  title: string;
  image_url: string | null;
  level: "Beginner" | "Intermediate" | "Advanced";
  weeks: number;
  total_spots: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  meeting_days: string;
  schedule_summary: string;
  location_tag: string;
  location_details: string;
  requirements: string | null;
  host_blurb: string | null;
  description: string | null;
  created_at: string;
  class_registrations: { id: string; user_id: string }[] | null;
};

export type ClassWithMeta = ClassRecord & {
  registrationCount: number;
  spotsLeft: number;
  isRegistered: boolean;
};

function withMeta(record: ClassRecord, userId?: string | null): ClassWithMeta {
  const registrations = record.class_registrations ?? [];
  const registrationCount = registrations.length;
  const spotsLeft = Math.max(record.total_spots - registrationCount, 0);
  const isRegistered = userId
    ? registrations.some((registration) => registration.user_id === userId)
    : false;

  return {
    ...record,
    class_registrations: registrations,
    registrationCount,
    spotsLeft,
    isRegistered,
  };
}

export function getUpcomingSessionDates(
  record: ClassRecord,
  referenceDate: Date = new Date(),
): Date[] {
  const progress = getClassProgress(record, referenceDate);
  if (progress.remainingOccurrences <= 0) {
    return [];
  }

  const startDate = parseDate(record.start_date);
  const endDate = parseDate(record.end_date);
  const sessions: Date[] = [];
  const startOffset = progress.totalOccurrences - progress.remainingOccurrences;

  for (let i = 0; i < progress.remainingOccurrences; i += 1) {
    const sessionDate = new Date(startDate);
    sessionDate.setDate(sessionDate.getDate() + (startOffset + i) * 7);

    if (sessionDate.getTime() > endDate.getTime()) {
      break;
    }

    sessions.push(sessionDate);
  }

  return sessions;
}

export async function getUpcomingClasses(
  supabase: Supabase,
  userId: string,
): Promise<ClassWithMeta[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("classes")
    .select(CLASS_SELECT_WITH_JOIN)
    .eq("class_registrations.user_id", userId)
    .gte("end_date", today)
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((record) => withMeta(record as ClassRecord, userId));
}

export async function getRecentClasses(
  supabase: Supabase,
  userId: string,
): Promise<ClassWithMeta[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("classes")
    .select(CLASS_SELECT_WITH_JOIN)
    .eq("class_registrations.user_id", userId)
    .lt("end_date", today)
    .order("end_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((record) => withMeta(record as ClassRecord, userId));
}

export async function getDtlaClasses(
  supabase: Supabase,
  userId?: string | null,
): Promise<ClassWithMeta[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("classes")
    .select(CLASS_SELECT_BASE)
    .eq("location_tag", "DTLA")
    .gte("start_date", today)
    .order("start_date", { ascending: true })
    .limit(12);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((record) => withMeta(record as ClassRecord, userId));
}

export async function getClassById(
  supabase: Supabase,
  classId: string,
  userId?: string | null,
): Promise<ClassWithMeta | null> {
  const { data, error } = await supabase
    .from("classes")
    .select(CLASS_SELECT_BASE)
    .eq("id", classId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return withMeta(data as ClassRecord, userId);
}

export async function getAttendedClasses(
  supabase: Supabase,
  userId: string,
): Promise<ClassWithMeta[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('classes')
    .select(CLASS_SELECT_WITH_JOIN)
    .eq('class_registrations.user_id', userId)
    .lte('start_date', today)
    .order('end_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((record) => withMeta(record as ClassRecord, userId));
}

export async function getTeachingClasses(
  supabase: Supabase,
  userId: string,
): Promise<ClassWithMeta[]> {
  const { data, error } = await supabase
    .from('classes')
    .select(CLASS_SELECT_BASE)
    .eq('host_id', userId)
    .order('start_date', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((record) => withMeta(record as ClassRecord, userId));
}
