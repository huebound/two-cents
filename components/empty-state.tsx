import Link from "next/link";
import { TOMO } from "@/lib/constants";

type EmptyStateProps = {
  emoji: string;
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
    variant?: "black" | "red";
  };
};

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
      <p className="text-3xl mb-2" aria-hidden="true">{emoji}</p>
      <p className="text-sm font-semibold text-gray-700" style={TOMO}>{title}</p>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
      {action && (
        <Link
          href={action.href}
          className={`mt-4 inline-flex rounded-full px-5 py-2 text-sm font-medium text-white transition-colors ${
            action.variant === "red"
              ? "bg-[#C94256] hover:bg-[#a33045]"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
