"use client";

import Link from "next/link";

export default function Sidebar({ className = "" }: { className?: string }) {
  return (
    <aside className={`${className} w-64 shrink-0`}>
      <nav className="sticky top-20 flex h-[calc(100vh-5rem)] flex-col gap-3 p-3">
        <Link href="/dashboard" className="rounded-full px-4 py-2 text-sm bg-white/10 text-white hover:bg-white/20 transition">
          Overview
        </Link>
        <Link href="/complaints/submit" className="rounded-full px-4 py-2 text-sm bg-white/10 text-white hover:bg-white/20 transition">
          Submit Complaint
        </Link>
      </nav>
    </aside>
  );
}
