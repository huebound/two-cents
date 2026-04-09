import { TeachForm } from "./teach-form";
import { TOMO } from "@/lib/constants";

export default function TeachPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-2">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1">
          <span className="text-xs font-medium tracking-widest text-white/60 uppercase">
            Host a class
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900" style={TOMO}>
          Share what you know.
        </h1>
        <p className="text-sm text-gray-500">
          Fill in the details below to publish your class to the Two Cents Club community.
        </p>
      </div>

      <TeachForm />
    </div>
  );
}
