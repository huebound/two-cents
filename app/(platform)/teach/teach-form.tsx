"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { cn } from "@/lib/utils";
import { createClassAction, type TeachFormState } from "./actions";
import { TOMO } from "@/lib/constants";

const initialState: TeachFormState = { status: "idle" };

type Step = 1 | 2 | 3;

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 1, label: "Basics",   icon: "📚" },
  { id: 2, label: "Schedule", icon: "📅" },
  { id: 3, label: "Publish",  icon: "✏️" },
];

// ── Textarea helper ──────────────────────────────────────────────────────────
function Textarea({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-[#C94256] focus:outline-none focus:ring-2 focus:ring-[#C94256]/20 transition resize-none"
    />
  );
}

// ── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all",
                  done  && "bg-emerald-500 text-white",
                  active && "bg-[#C94256] text-white shadow-md shadow-[#C94256]/30",
                  !done && !active && "bg-gray-100 text-gray-400",
                )}
                style={active ? TOMO : undefined}
              >
                {done ? "✓" : step.icon}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  active ? "text-[#C94256]" : done ? "text-emerald-600" : "text-gray-400",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 mb-5 h-px w-12 transition-colors",
                  done ? "bg-emerald-400" : "bg-gray-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Review row ───────────────────────────────────────────────────────────────
function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function TeachForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createClassAction, initialState);

  const [step, setStep] = useState<Step>(1);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // Step 1 — Basics
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [hostBlurb, setHostBlurb]   = useState("");
  const [imageUrl, setImageUrl]     = useState("");
  const [totalSpots, setTotalSpots] = useState("");

  // Step 2 — Schedule
  const [weeks, setWeeks]                 = useState("");
  const [startDate, setStartDate]         = useState("");
  const [endDate, setEndDate]             = useState("");
  const [startTime, setStartTime]         = useState("");
  const [endTime, setEndTime]             = useState("");
  const [meetingDays, setMeetingDays]     = useState("");
  const [locationDetails, setLocationDetails] = useState("");

  // Auto-calculate end date
  useEffect(() => {
    if (startDate && weeks) {
      const weeksNum = parseInt(weeks, 10);
      if (!isNaN(weeksNum) && weeksNum > 0) {
        const end = new Date(startDate + "T00:00:00");
        end.setDate(end.getDate() + weeksNum * 7);
        setEndDate(end.toISOString().split("T")[0]);
      }
    }
  }, [startDate, weeks]);

  useEffect(() => {
    if (state.status === "success") {
      router.push(`/classes/${state.classId}`);
    }
  }, [state, router]);

  // ── Validation ──────────────────────────────────────────
  const validateStep = (s: Step): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!title.trim()) errs.title = "Class title is required.";
      if (!description.trim()) errs.description = "Class description is required.";
    }
    if (s === 2) {
      if (!weeks || parseInt(weeks, 10) <= 0) errs.weeks = "Enter number of sessions.";
      if (!startDate) errs.startDate = "Start date is required.";
      if (!startTime) errs.startTime = "Start time is required.";
      if (!endTime) errs.endTime = "End time is required.";
      if (startTime && endTime && endTime <= startTime) errs.endTime = "End time must be after start time.";
    }
    return errs;
  };

  const goNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setStepErrors(errs); return; }
    setStepErrors({});
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  };

  const goBack = () => {
    setStepErrors({});
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  };

  return (
    <div className="space-y-8">
      {/* ── Step indicator ─────────────────────────────── */}
      <div className="flex justify-center pt-2">
        <StepIndicator current={step} />
      </div>

      <form action={formAction}>
        {/* Hidden fields for steps not currently shown */}
        <input type="hidden" name="imageUrl"         value={imageUrl} />
        <input type="hidden" name="title"            value={title} />
        <input type="hidden" name="description"      value={description} />
        <input type="hidden" name="hostBlurb"        value={hostBlurb} />
        <input type="hidden" name="totalSpots"       value={totalSpots} />
        <input type="hidden" name="weeks"            value={weeks} />
        <input type="hidden" name="startDate"        value={startDate} />
        <input type="hidden" name="endDate"          value={endDate} />
        <input type="hidden" name="startTime"        value={startTime} />
        <input type="hidden" name="endTime"          value={endTime} />
        <input type="hidden" name="meetingDays"      value={meetingDays} />
        <input type="hidden" name="locationDetails"  value={locationDetails} />

        {/* ── Step 1: Basics ───────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-semibold text-gray-900" style={TOMO}>
                📚 Tell us about your class
              </h2>

              <Field label="Class title" error={stepErrors.title}>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Crossword Lab: Build your puzzle skills"
                  className={cn(stepErrors.title && "border-red-400")}
                />
                <p className="text-right text-[10px] text-gray-400 mt-1">
                  {title.length}/80
                </p>
              </Field>

              <Field label="Cover image" hint="Recommended: 1200×675px (16:9). Leave blank to use a placeholder.">
                <ImageUpload onUploadComplete={setImageUrl} currentImage={imageUrl} />
              </Field>

              <Field label="Short description" error={stepErrors.description}>
                <Textarea
                  name=""
                  value={description}
                  onChange={setDescription}
                  placeholder="What will students discover in this class? Keep it vivid and inviting."
                  rows={4}
                />
              </Field>

              <Field label="About you (optional)" hint="A brief intro to share with enrollees.">
                <Textarea
                  name=""
                  value={hostBlurb}
                  onChange={setHostBlurb}
                  placeholder="Hi, I'm Ava. I've been solving crosswords since I was 15…"
                  rows={3}
                />
              </Field>

              <Field label="Spots available" hint="Leave blank for unlimited enrollment.">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={totalSpots}
                  onChange={(e) => setTotalSpots(e.target.value)}
                  placeholder="e.g. 20"
                  className="max-w-[160px]"
                />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 2: Schedule ─────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-semibold text-gray-900" style={TOMO}>
                📅 When does it happen?
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Number of sessions" error={stepErrors.weeks}>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    placeholder="e.g. 6"
                    className={cn(stepErrors.weeks && "border-red-400")}
                  />
                </Field>
                <Field label="Total spots" hint="Optional">
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={totalSpots}
                    onChange={(e) => setTotalSpots(e.target.value)}
                    placeholder="Unlimited"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Start date" error={stepErrors.startDate}>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={cn(stepErrors.startDate && "border-red-400")}
                  />
                </Field>
                <Field label="End date" hint="Auto-calculated from sessions">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Start time" error={stepErrors.startTime}>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={cn(stepErrors.startTime && "border-red-400")}
                  />
                </Field>
                <Field label="End time" error={stepErrors.endTime}>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={cn(stepErrors.endTime && "border-red-400")}
                  />
                </Field>
              </div>

              <Field label="Meeting days" hint="e.g. Saturdays, Tues/Thurs, Every other Sunday">
                <Input
                  value={meetingDays}
                  onChange={(e) => setMeetingDays(e.target.value)}
                  placeholder="Saturdays"
                />
              </Field>

              <Field label="Location" hint="Address, neighbourhood, or 'Online via Zoom'">
                <Input
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="Café/5, Jefferson Park, LA"
                />
              </Field>
            </div>

            {/* Session preview */}
            {startDate && weeks && parseInt(weeks, 10) > 0 && (
              <div className="rounded-2xl border border-dashed border-[#C94256]/30 bg-[#C94256]/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C94256] mb-3">
                  Session preview
                </p>
                <div className="space-y-1">
                  {Array.from({ length: Math.min(parseInt(weeks, 10), 5) }).map((_, i) => {
                    const d = new Date(startDate + "T00:00:00");
                    d.setDate(d.getDate() + i * 7);
                    return (
                      <p key={i} className="text-sm text-gray-700">
                        <span className="font-medium text-gray-400 mr-2">
                          Session {i + 1}
                        </span>
                        {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        {startTime && (
                          <span className="text-gray-400">
                            {" · "}
                            {new Date(`2000-01-01T${startTime}`).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </p>
                    );
                  })}
                  {parseInt(weeks, 10) > 5 && (
                    <p className="text-xs text-gray-400 pt-1">
                      + {parseInt(weeks, 10) - 5} more sessions
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Review & Publish ──────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4" style={TOMO}>
                ✏️ Review before publishing
              </h2>

              {/* Cover image preview */}
              {imageUrl && (
                <div className="mb-5 overflow-hidden rounded-xl">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}

              <div>
                <ReviewRow label="Title"       value={title} />
                <ReviewRow label="Description" value={description} />
                <ReviewRow label="Host intro"  value={hostBlurb} />
                <ReviewRow label="Sessions"    value={weeks ? `${weeks} ${parseInt(weeks) === 1 ? "session" : "sessions"}` : ""} />
                <ReviewRow label="Starts"      value={startDate ? new Date(startDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""} />
                <ReviewRow label="Time"        value={[startTime, endTime].filter(Boolean).join(" – ")} />
                <ReviewRow label="Meeting days" value={meetingDays} />
                <ReviewRow label="Location"    value={locationDetails} />
                <ReviewRow label="Spots"       value={totalSpots ? `${totalSpots} spots` : "Unlimited"} />
              </div>
            </div>

            {state.status === "error" && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{state.message}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Navigation buttons ────────────────────────── */}
        <div className={cn("mt-6 flex items-center", step === 1 ? "justify-end" : "justify-between")}>
          {step > 1 && (
            <Button type="button" variant="outline" onClick={goBack}>
              ←
            </Button>
          )}

          {step < 3 ? (
            <Button type="button" onClick={goNext} className="bg-[#C94256] hover:bg-[#a33045]">
              Next: {STEPS[step].label} →
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#C94256] hover:bg-[#a33045] px-8"
            >
              {isPending ? "Publishing…" : "🎓 Publish Class"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TeachForm;
