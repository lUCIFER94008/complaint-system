"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ email?: string; role?: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const item = localStorage.getItem("auth");
      setAuth(item ? JSON.parse(item) : null);
    } catch {
      setAuth(null);
    }
  }, []);

  function logout() {
    try {
      localStorage.removeItem("auth");
    } catch {}
    setAuth(null);
    router.push("/");
  }

  // Wait until mounted before deciding whether to show Navbar. If unauthenticated
  // we let the global TopNav handle header UI.
  if (!mounted) return null;
  if (!auth) return null;

  return (
    <header className="w-full border-b border-white/10 bg-black/0 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold tracking-wide text-white">
            Complaint System
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
            Home
          </Link>
          <Link href="/feedback" className="hidden sm:inline text-sm text-muted-2 hover:text-white transition">
            Feedback
          </Link>

          <Link href={auth.role === "admin" ? "/admin" : "/dashboard"} className="text-sm text-white">
            Dashboard
          </Link>
          <button onClick={logout} className="ml-2 btn-secondary">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
