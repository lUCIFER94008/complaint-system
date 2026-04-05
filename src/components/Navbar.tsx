"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const router = useRouter();
  const [auth, setAuth] = useState<{ email?: string; role?: string; name?: string } | null>(null);
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

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          {/* Hamburger (Mobile) */}
          <button 
            onClick={onToggleSidebar}
            className="md:hidden text-white p-1 hover:bg-white/10 rounded-lg transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
          
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
            </div>
            <span className="hidden sm:inline">Complaint System</span>
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-all duration-300">Home</Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-all duration-300">Dashboard</Link>
          <Link href="/complaints/submit" className="text-sm font-medium text-gray-400 hover:text-white transition-all duration-300">Complaints</Link>
          {auth?.role === "admin" && (
            <Link href="/admin" className="text-sm font-medium text-gray-400 hover:text-white transition-all duration-300">Admin</Link>
          )}
        </nav>

        {/* Right: Auth Profile */}
        <div className="flex items-center gap-4">
          {auth ? (
            <div className="flex items-center gap-4">
              <span className="hidden lg:inline text-xs text-gray-500">{auth.email}</span>
              <button 
                onClick={logout}
                className="bg-white/5 border border-white/10 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-white/10 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="bg-lime-400 text-black rounded-full px-5 py-2 text-sm font-bold hover:bg-lime-300 transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
