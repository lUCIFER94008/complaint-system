"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ComplaintCard from "@/components/ComplaintCard";

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "inprogress" | "resolved";
  createdAt: string;
};

export default function DashboardPage() {
  const [auth, setAuth] = useState<{ email?: string; role?: string } | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    try {
      const item = localStorage.getItem("auth");
      setAuth(item ? JSON.parse(item) : null);
    } catch {
      setAuth(null);
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/complaints");
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch {
        setComplaints([]);
      }
    }
    load();
  }, []);

  if (!auth) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <Navbar />
        <main className="mx-auto max-w-4xl p-8">
          <div className="card-surface p-8"> 
            <h2 className="text-lg font-semibold">Please sign in</h2>
            <p className="mt-2 text-sm text-muted">Sign in to see your complaints and submit new ones.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <Sidebar />

        <main className="flex-1">
          <div className="mb-6 rounded-2xl card-surface p-6">
            <h1 className="text-2xl font-semibold">Your Complaints</h1>
            <p className="mt-1 text-sm text-muted">A quick overview of your recent submissions.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {complaints.length === 0 ? (
              <div className="rounded-2xl card-surface p-6 text-muted">No complaints yet — submit one from the sidebar.</div>
            ) : (
              complaints.map((c) => (
                <ComplaintCard key={c.id} title={c.title} description={c.description} status={c.status} date={new Date(c.createdAt).toLocaleString()} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

