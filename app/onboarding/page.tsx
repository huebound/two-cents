"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { PROFILE_TOPIC_OPTIONS } from "@/lib/profile-options";
import { Search } from "lucide-react";

const PERSONALITY_QUESTIONS = [
  {
    question: "When learning something new, I prefer to:",
    options: [
      "Read detailed instructions first",
      "Jump in and figure it out as I go",
      "Watch someone else do it first",
      "Discuss it with others before starting",
    ],
  },
  // Add more questions as needed
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [curiousAbout, setCuriousAbout] = useState<string[]>([]);
  const [knowledge, setKnowledge] = useState<string[]>([]);
  const [personalityAnswers, setPersonalityAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        await supabase.auth.signOut();
        router.push("/");
        return;
      }

      const normalizedFirstName = firstName.trim();
      const normalizedLastName = lastName.trim();

      // Update profile in database
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: normalizedFirstName,
          last_name: normalizedLastName,
          curious_about: curiousAbout,
          knowledge: knowledge,
          personality_answers: personalityAnswers,
        } as never, { onConflict: "id" });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      // Mark as onboarded in user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { onboarded: true, first_name: normalizedFirstName, last_name: normalizedLastName },
      });

      if (metadataError) {
        setError(metadataError.message);
        return;
      }

      router.push("/home");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTopic = (topic: string, list: string[], setList: (topics: string[]) => void) => {
    if (list.includes(topic)) {
      setList(list.filter((t) => t !== topic));
    } else {
      setList([...list, topic]);
    }
  };

  const handlePersonalityAnswer = (optionIndex: number) => {
    const newAnswers = [...personalityAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setPersonalityAnswers(newAnswers);
  };

  const nextStep = () => {
    if (step === 4 && currentQuestion < PERSONALITY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep(step + 1);
    }
  };

  // Step 0: Basic Info
  if (step === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <main className="flex w-full max-w-md flex-col gap-6 px-8">
          <h1 className="text-2xl font-semibold">The basics</h1>

          <div className="flex gap-3">
            <Input
              placeholder="First"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Button
            onClick={nextStep}
            className="mt-4 rounded-full bg-black px-8 py-2 text-white hover:bg-gray-800"
            disabled={firstName.trim().length === 0 || lastName.trim().length === 0}
          >
            Continue
          </Button>
        </main>
      </div>
    );
  }

  // Step 1: What are you curious about?
  if (step === 1) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <main className="flex w-full max-w-md flex-col gap-6 rounded-lg border p-8">
          <h1 className="text-xl font-medium">What are you curious about?</h1>

          <div className="relative">
            <Input placeholder="Search..." className="pr-10" />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            {PROFILE_TOPIC_OPTIONS.map((topic) => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic, curiousAbout, setCuriousAbout)}
                className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                  curiousAbout.includes(topic)
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black hover:border-gray-400"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          <Button
            onClick={nextStep}
            className="mt-4 rounded-full bg-black px-8 py-2 text-white hover:bg-gray-800"
          >
            Continue
          </Button>
        </main>
      </div>
    );
  }

  // Step 2: What do you know?
  if (step === 2) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <main className="flex w-full max-w-md flex-col gap-6 rounded-lg border p-8">
          <h1 className="text-xl font-medium">What do you know?</h1>

          <div className="relative">
            <Input placeholder="Search..." className="pr-10" />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            {PROFILE_TOPIC_OPTIONS.map((topic) => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic, knowledge, setKnowledge)}
                className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                  knowledge.includes(topic)
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black hover:border-gray-400"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          <Button
            onClick={nextStep}
            className="mt-4 rounded-full bg-black px-8 py-2 text-white hover:bg-gray-800"
          >
            Continue
          </Button>
        </main>
      </div>
    );
  }

  // Step 3: Personality Test Intro
  if (step === 3) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-600">
        <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border-2 border-black bg-white p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-300 bg-white">
            <div className="h-6 w-6 rounded-full bg-black" />
          </div>

          <h1 className="font-['Brush_Script_MT'] text-5xl">Elvira</h1>

          <div className="text-center">
            <p className="text-2xl font-medium">What type of</p>
            <p className="text-2xl font-medium">learner are you?</p>
          </div>

          <Button
            onClick={nextStep}
            className="mt-4 rounded-full border-2 border-black bg-white px-8 py-2 text-black hover:bg-gray-100"
          >
            Begin
          </Button>
        </main>
      </div>
    );
  }

  // Step 4: Personality Questions
  if (step === 4) {
    const question = PERSONALITY_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / PERSONALITY_QUESTIONS.length) * 100;

    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <main className="flex w-full max-w-3xl flex-col gap-8 p-8">
          {/* Progress bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute left-0 top-0 h-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-4 border-gray-300 bg-black transition-all"
              style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
            >
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium">Question {currentQuestion + 1}.</h2>
            <Button
              onClick={() => {
                if (currentQuestion === PERSONALITY_QUESTIONS.length - 1) {
                  handleCompleteOnboarding();
                } else {
                  nextStep();
                }
              }}
              className="rounded-full border-2 border-black bg-white px-6 py-2 text-black hover:bg-gray-100"
              disabled={isLoading || personalityAnswers[currentQuestion] === undefined}
            >
              {isLoading && currentQuestion === PERSONALITY_QUESTIONS.length - 1 ? "Finishing..." : "Continue"}
            </Button>
          </div>

          {/* Question content - placeholder for now */}
          <div className="h-48 rounded-lg bg-gray-200" />

          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handlePersonalityAnswer(idx)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  personalityAnswers[currentQuestion] === idx
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                Option {String.fromCharCode(65 + idx)}
              </button>
            ))}
          </div>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </main>
      </div>
    );
  }

  return null;
}
