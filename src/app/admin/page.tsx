"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ComplaintCard from "@/components/ComplaintCard";

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "inprogress" | "resolved";
  createdAt: string;
};

export default function AdminPage() {
  const [auth, setAuth] = useState<{ email?: string; role?: string } | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<{ users?: number; complaints?: number; feedback?: number; complaintsBreakdown?: any } | null>(null);
  const [users, setUsers] = useState<Array<{ name?: string; email: string; role: string }>>([]);

  async function deleteUser(email: string) {
    try {
      const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', email }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Failed');
      setUsers((cur) => cur.filter((u) => u.email !== email));
      // reload stats
      const s = await fetch('/api/admin/stats'); const sd = await s.json(); setStats(sd.stats || null);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  async function toggleRole(email: string) {
    try {
      const u = users.find((x) => x.email === email);
      if (!u) return;
      const newRole = u.role === 'admin' ? 'user' : 'admin';
      const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', email, role: newRole }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Failed');
      setUsers((cur) => cur.map((x) => x.email === email ? { ...x, role: newRole } : x));
      const s = await fetch('/api/admin/stats'); const sd = await s.json(); setStats(sd.stats || null);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

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
        const s = await fetch("/api/admin/stats");
        const sd = await s.json();
        setStats(sd.stats || null);
        const res = await fetch("/api/complaints");
        const data = await res.json();
        setComplaints(data.complaints || []);

        // load users for admin controls
        const ures = await fetch('/api/admin/users');
        const udata = await ures.json();
        setUsers(udata.users || []);
      } catch {
        setComplaints([]);
      }
    }

    if (auth?.role === "admin") load();
  }, [auth]);

  if (!auth) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <main className="mx-auto max-w-4xl p-8">
          <div className="card-surface p-8"> 
            <h2 className="text-lg font-semibold">Please sign in</h2>
            <p className="mt-2 text-sm text-muted">Sign in with an admin account to access this page.</p>
          </div>
        </main>
      </div>
    );
  }

  if (auth.role !== "admin") {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <main className="mx-auto max-w-4xl p-8">
          <div className="card-surface p-8"> 
            <h2 className="text-lg font-semibold">Access denied</h2>
            <p className="mt-2 text-sm text-muted">You are signed in but not an admin.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <main className="mx-auto max-w-6xl p-8">
        <div className="mb-6 rounded-2xl card-surface p-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of system activity and complaint management.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl card-surface p-4">
            <h3 className="text-sm text-muted">Users</h3>
            <p className="text-2xl font-semibold">{stats?.users ?? "..."}</p>
          </div>
          <div className="rounded-2xl card-surface p-4">
            <h3 className="text-sm text-muted">Complaints</h3>
            <p className="text-2xl font-semibold">{stats?.complaints ?? "..."}</p>
            <div className="mt-2 text-sm text-muted">
              <span className="mr-4">Pending: {stats?.complaintsBreakdown?.pending ?? 0}</span>
              <span className="mr-4">In Progress: {stats?.complaintsBreakdown?.inprogress ?? 0}</span>
              <span>Resolved: {stats?.complaintsBreakdown?.resolved ?? 0}</span>
            </div>
          </div>
          <div className="rounded-2xl card-surface p-4">
            <h3 className="text-sm text-muted">Feedback</h3>
            <p className="text-2xl font-semibold">{stats?.feedback ?? "..."}</p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Users</h2>
          <div className="grid gap-3">
            {users.length === 0 ? (
              <div className="rounded-2xl card-surface p-4 text-muted">No users found</div>
            ) : (
              users.map((u) => (
                <div key={u.email} className="flex items-center justify-between rounded-2xl card-surface p-4">
                  <div>
                    <div className="font-semibold">{u.name || '(no name)'}</div>
                    <div className="text-sm text-[var(--muted)]">{u.email} • {u.role}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async () => { await toggleRole(u.email); }} className="rounded-md btn-secondary px-3 py-1 text-sm">Toggle Role</button>
                    <button onClick={async () => { if (confirm('Delete user ' + u.email + '?')) await deleteUser(u.email); }} className="rounded-md bg-red-500/10 px-3 py-1 text-sm text-red-400">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recent Complaints</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {complaints.map((c) => (
              <ComplaintCard
                key={c.id}
                id={c.id}
                title={c.title}
                description={c.description}
                status={c.status}
                date={new Date(c.createdAt).toLocaleString()}
                onResolve={async () => {
                  try {
                    const res = await fetch('/api/complaints', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, status: 'resolved' }) });
                    const j = await res.json();
                    if (!res.ok) throw new Error(j?.error || 'Failed');
                    // update local list
                    setComplaints((cur) => cur.map((x) => x.id === c.id ? { ...x, status: 'resolved' } : x));
                    const s = await fetch('/api/admin/stats'); const sd = await s.json(); setStats(sd.stats || null);
                  } catch (err) {
                    alert(err instanceof Error ? err.message : String(err));
                  }
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

