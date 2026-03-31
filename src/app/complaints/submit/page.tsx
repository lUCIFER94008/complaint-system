"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function SubmitComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const [auth, setAuth] = useState<{ email?: string; role?: string; name?: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (!auth) {
      // if not authenticated, prompt user to login instead of submitting
      setMessage("Please sign in to submit a complaint.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, name: name || auth?.name, email: email || auth?.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create");
      setMessage("Complaint submitted");
      setTitle("");
      setDescription("");
      setName("");
      setEmail("");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      const item = localStorage.getItem('auth');
      const parsed = item ? JSON.parse(item) : null;
      setAuth(parsed);
      if (parsed) {
        setName(parsed.name || '');
        setEmail(parsed.email || '');
      }
    } catch {
      setAuth(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <Sidebar />
        <main className="flex-1">
          <div className="rounded-2xl card-surface p-6">
            <h1 className="text-2xl font-semibold text-white">Submit Complaint</h1>
            <p className="mt-1 text-sm text-white/70">Provide details and submit — we'll track status for you.</p>

            {!auth ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-white/10 p-4 bg-transparent">
                  <p className="text-sm text-white/80">You need to be signed in to submit a complaint.</p>
                  <div className="mt-3 flex gap-3">
                    <a href="/login" className="rounded-full btn-primary px-4 py-2 text-sm font-semibold">Login</a>
                    <a href="/register" className="rounded-full btn-secondary px-4 py-2 text-sm font-semibold">Register</a>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-white">Full name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>

                <div>
                  <label className="text-sm text-white">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>

                <div>
                  <label className="text-sm text-white">Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>

                <div>
                  <label className="text-sm text-white">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-2 w-full min-h-[140px] rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                </div>

                <div>
                  <label className="text-sm text-white">Attachment (optional)</label>
                  <input type="file" className="mt-2 w-full text-sm text-white/70" />
                </div>

                {message ? <div className="text-sm text-white/80">{message}</div> : null}

                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 transition">{loading ? "Submitting…" : "Submit"}</button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
