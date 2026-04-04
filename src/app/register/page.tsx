"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          adminCode: role === "admin" ? adminCode : undefined,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) throw new Error(data?.error ?? "Registration failed");

      setMessage("Registration successful. You can login now.");
      setName("");
      setEmail("");
      setPassword("");
      setAdminCode("");
      setRole("user");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <main className="w-full max-w-lg card-surface p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-white">Create account</h1>
        <p className="mt-1 text-sm text-muted">Register to submit and track complaints</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm text-[var(--muted)]">Full name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>

          <div>
            <label htmlFor="email" className="text-sm text-[var(--muted)]">Email</label>
            <input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-[var(--muted)]">Password</label>
            <input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          </div>

          <div>
            <label htmlFor="role" className="text-sm text-[var(--muted)]">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as any)} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {role === "admin" ? (
            <div>
              <label htmlFor="adminCode" className="text-sm text-[var(--muted)]">Admin code</label>
              <input id="adminCode" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} type="password" placeholder="Admin secret code" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]" />
              {process.env.NODE_ENV !== 'production' ? (
                <p className="mt-2 text-xs text-zinc-400">Development: default admin code is <strong>ADMIN_SECRET</strong></p>
              ) : null}
            </div>
          ) : null}

          {message ? <div className="text-sm text-emerald-400">{message}</div> : null}
          {error ? <div className="text-sm text-red-400">{error}</div> : null}

          <button disabled={loading} type="submit" className="w-full rounded-full btn-primary px-4 py-2 text-sm font-semibold disabled:opacity-60">
            {loading ? "Registering..." : "Create account"}
          </button>
        </form>
      </main>
    </div>
  );
}

