"use client";

import { useState, type FormEvent } from "react";
import TopNav from "@/components/TopNav";

export default function ComplaintsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) throw new Error(data?.error ?? "Failed to submit complaint");

      setSuccess("Complaint submitted successfully.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans">
      <TopNav title="Complaint Register" />
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="card-surface p-6">
          <h2 className="text-xl font-semibold text-white">
            Register a complaint
          </h2>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="block w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/10"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="block w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/10"
            />
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your complaint"
              className="block w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/10"
            />

            {success ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              disabled={loading}
              type="submit"
              className="rounded-2xl btn-primary px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

