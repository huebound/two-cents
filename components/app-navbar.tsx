"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/auth-dialog";
import { createClient } from "@/utils/supabase/client";
import { TOMO } from "@/lib/constants";

type SiteNavbarProps = {
  isLoggedIn?: boolean;
  firstName?: string | null;
};

export function SiteNavbar({ isLoggedIn, firstName }: SiteNavbarProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href={isLoggedIn ? "/home" : "/"} className="flex items-center gap-2.5">
          <img
            src="/images/2C-Landing-Assets/googly-eye.png"
            alt=""
            className="h-7 w-7"
          />
          <span className="font-medium text-black text-[17px]" style={TOMO}>
            Two Cents Club
          </span>
        </Link>

        {isLoggedIn ? (
          <nav className="flex items-center gap-4">
            <div ref={menuRef} className="relative">
              <button
                className="cursor-pointer font-medium text-black text-sm md:text-[18px]"
                style={TOMO}
                onClick={() => setMenuOpen((o) => !o)}
              >
                Hi, {firstName ? `${firstName}!` : "there"}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-28 rounded-xl border border-gray-100 bg-white py-1 shadow-md">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <>
            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
            <nav className="flex items-center gap-5 md:gap-8">
              <button
                className="cursor-pointer font-medium text-black hover:underline text-sm md:text-[18px]"
                style={TOMO}
                onClick={() => setAuthOpen(true)}
              >
                Join the Club
              </button>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}

export { SiteNavbar as AppNavbar };
export default SiteNavbar;
