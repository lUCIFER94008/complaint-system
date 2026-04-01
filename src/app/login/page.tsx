"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Login failed");
      try {
        localStorage.setItem("auth", JSON.stringify({ email: data.email, role: data.role, name: data.name }));
      } catch {}
      router.push(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <main className="w-full max-w-md card-surface p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to access your dashboard</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-[var(--muted)]">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>

          <div>
            <label className="text-sm text-[var(--muted)]">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>

          {error ? <div className="text-sm text-red-400">{error}</div> : null}

          <button type="submit" disabled={loading} className="w-full rounded-full btn-primary px-4 py-2 text-sm font-semibold disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted)]">
          <p>
            New here? <Link href="/register" className="text-[var(--accent)]">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

