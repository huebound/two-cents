import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type AppNavbarProps = {
  firstName?: string | null;
};

export function AppNavbar({ firstName }: AppNavbarProps) {
  const profileInitial = firstName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/home" className="text-lg font-medium tracking-tight">
          Two Cents Club
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/home" className="transition hover:text-black">
            Discover
          </Link>
          <Link href="/classes" className="transition hover:text-black">
            Classes
          </Link>
          <Link href="/teach" className="transition hover:text-black">
            Teach
          </Link>
          <button
            type="button"
            className="rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-black"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link
            href="/profile"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black",
            )}
            aria-label="Profile"
          >
            {profileInitial}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default AppNavbar;
