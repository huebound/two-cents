"use client";

import { useActionState, useState } from "react";
import { PROFILE_TOPIC_OPTIONS } from "@/lib/profile-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAction, type ProfileFormState } from "./actions";

export type ProfileFormProps = {
  firstName: string;
  lastName: string;
  username: string | null;
  knowledge: string[];
  wantToLearn: string[];
};

const INITIAL_STATE: ProfileFormState = { status: "idle" };

export function ProfileForm({
  firstName,
  lastName,
  username,
  knowledge,
  wantToLearn,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, INITIAL_STATE);
  const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>(knowledge);
  const [selectedWantToLearn, setSelectedWantToLearn] = useState<string[]>(wantToLearn);

  const toggleTopic = (topic: string, list: string[], setList: (topics: string[]) => void) => {
    if (list.includes(topic)) {
      setList(list.filter((t) => t !== topic));
    } else {
      setList([...list, topic]);
    }
  };

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

      <fieldset className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        <legend>Can Teach</legend>
        <div className="flex flex-wrap gap-2">
          {PROFILE_TOPIC_OPTIONS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic, selectedKnowledge, setSelectedKnowledge)}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                selectedKnowledge.includes(topic)
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-gray-400"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        {selectedKnowledge.map((topic) => (
          <input key={topic} type="hidden" name="knowledge" value={topic} />
        ))}
        <span className="text-xs font-normal text-gray-500">Select the topics you feel confident teaching.</span>
      </fieldset>

      <fieldset className="flex flex-col gap-2 text-sm font-medium text-gray-700">
        <legend>Want to Learn</legend>
        <div className="flex flex-wrap gap-2">
          {PROFILE_TOPIC_OPTIONS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic, selectedWantToLearn, setSelectedWantToLearn)}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                selectedWantToLearn.includes(topic)
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-black hover:border-gray-400"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        {selectedWantToLearn.map((topic) => (
          <input key={topic} type="hidden" name="wantToLearn" value={topic} />
        ))}
        <span className="text-xs font-normal text-gray-500">Select the topics you want to learn.</span>
      </fieldset>

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
