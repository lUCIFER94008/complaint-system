"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type TopNavProps = {
  title: string;
};

export default function TopNav({ title }: TopNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Read auth synchronously (TopNav is a client component) to avoid a
  // Defer reading `localStorage` until after mount so server and client
  // markup remain consistent and avoid hydration mismatches.
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
    router.push("/");
    setAuth(null);
  }

  // Avoid rendering until after mount to keep server/client HTML identical.
  if (!mounted) return null;

  // If user is signed in, the app shows a `Navbar` inside pages (dashboard,
  // submit, etc.). Hide the global TopNav when authenticated to avoid
  // duplicate navbars. Also hide on admin pages (admin has its own layout).
  if (auth || (pathname && pathname.startsWith("/admin"))) return null;

  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-base font-semibold text-white">{title}</h1>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            className="text-gray-400 hover:text-white"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-gray-400 hover:text-white"
            href="/feedback"
          >
            Feedback
          </Link>

          {auth ? (
            <>
              <span className="hidden sm:inline text-gray-500">{auth.role}</span>
              <Link
                className="text-gray-400 hover:text-white"
                href={auth.role === "admin" ? "/admin" : "/dashboard"}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-lg btn-secondary ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

