"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { cn } from "@/lib/utils";
import { createClassAction, type TeachFormState } from "./actions";

const initialState: TeachFormState = { status: "idle" };

export function TeachForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createClassAction, initialState);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (state.status === "success") {
      router.push(`/classes/${state.classId}`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-6">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Title
          <Input name="title" placeholder="Crossword Lab: Build your puzzle skills" required />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Class image
          <ImageUpload onUploadComplete={setImageUrl} currentImage={imageUrl} />
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Weeks
            <Input name="weeks" type="number" min={1} step={1} required />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Total spots
            <Input name="totalSpots" type="number" min={1} step={1} required />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Level
          <select
            name="level"
            defaultValue="Beginner"
            className={cn(
              "h-9 w-full rounded-md border border-gray-300 px-3 text-sm shadow-xs focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
            )}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Start date
            <Input name="startDate" type="date" required />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            End date
            <Input name="endDate" type="date" required />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Start time
            <Input name="startTime" type="time" required />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            End time
            <Input name="endTime" type="time" required />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Meeting days
          <Input name="meetingDays" placeholder="Saturdays" required />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Schedule label
          <Input name="scheduleSummary" placeholder="Weekly" required />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Location tag
            <select
              name="locationTag"
              defaultValue="DTLA"
              className={cn(
                "h-9 w-full rounded-md border border-gray-300 px-3 text-sm shadow-xs focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
              )}
            >
              <option value="DTLA">DTLA</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Location details
            <Input name="locationDetails" placeholder="Cafe/5, Jefferson Park, LA" required />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          What learners should bring
          <Input name="requirements" placeholder="An interest in crosswords" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Host introduction
          <textarea
            name="hostBlurb"
            required
            rows={4}
            placeholder="Hi, I'm Ava. I've been solving crosswords since I was 15..."
            className={cn(
              "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
            )}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Class description
          <textarea
            name="description"
            required
            rows={4}
            placeholder="This class is meant for anyone that is interested in crosswords..."
            className={cn(
              "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
            )}
          />
        </label>
      </div>

      {state.status === "error" ? (
        <p className="text-sm text-red-600">{state.message}</p>
      ) : null}

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Creating class…" : "Create class"}
      </Button>
    </form>
  );
}

export default TeachForm;
