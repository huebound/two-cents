"use client";

import { useActionState } from "react";
import { PROFILE_TOPIC_OPTIONS, LEARN_ROLE_OPTIONS } from "@/lib/profile-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction, type ProfileFormState } from "./actions";

export type ProfileFormProps = {
  firstName: string;
  lastName: string;
  username: string | null;
  knowledge: string[];
  wantToLearnRole: string | null;
};

const INITIAL_STATE: ProfileFormState = { status: "idle" };

export function ProfileForm({
  firstName,
  lastName,
  username,
  knowledge,
  wantToLearnRole,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-6">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          First name
          <Input name="firstName" defaultValue={firstName} required />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Last name
          <Input name="lastName" defaultValue={lastName} required />
        </label>
      </fieldset>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Username
        <Input
          name="username"
          defaultValue={username ?? ""}
          placeholder="@yourname"
        />
        <span className="text-xs font-normal text-gray-500">Pick something unique so friends can find you.</span>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Can Teach
        <select
          name="knowledge"
          multiple
          defaultValue={knowledge}
          className="h-36 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          {PROFILE_TOPIC_OPTIONS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        <span className="text-xs font-normal text-gray-500">Select the topics you feel confident teaching.</span>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        Want to Learn
        <select
          name="wantToLearnRole"
          defaultValue={wantToLearnRole ?? ""}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm shadow-xs focus-visible:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <option value="">Choose your role</option>
          {LEARN_ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>

      {state.status === "error" ? (
        <p className="text-sm text-red-600">{state.message}</p>
      ) : null}
      {state.status === "success" ? (
        <p className="text-sm text-emerald-600">Profile updated.</p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}

export default ProfileForm;
