"use client";

import { useEffect, useState } from "react";
import ComplaintCard from "@/components/ComplaintCard";
import { toast } from "react-hot-toast";

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "inprogress" | "resolved";
  createdAt: string;
  userEmail?: string;
  userPhone?: string;
};

export default function AdminPage() {
  const [auth, setAuth] = useState<{ id?: string; name?: string; email?: string; role?: string } | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<{ users?: number; complaints?: number; feedback?: number; complaintsBreakdown?: any } | null>(null);
  const [users, setUsers] = useState<Array<{ name?: string; email: string; role: string }>>([]);

  async function deleteUser(email: string) {
    try {
      const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', email }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Failed');
      setUsers((cur) => cur.filter((u) => u.email !== email));
      toast.success("User deleted");
      const s = await fetch('/api/admin/stats'); const sd = await s.json(); setStats(sd.stats || null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
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
      toast.success(`Role updated to ${newRole}`);
      const s = await fetch('/api/admin/stats'); const sd = await s.json(); setStats(sd.stats || null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to toggle role");
    }
  }

  async function deleteComplaint(id: string) {
    if (!confirm('Are you sure you want to delete this complaint?')) return;
    try {
      const res = await fetch(`/api/complaints?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setComplaints((cur) => cur.filter((c) => c.id !== id));
      toast.success("Complaint deleted");
      const s = await fetch('/api/admin/stats'); const sd = await s.json(); setStats(sd.stats || null);
    } catch (err) {
      toast.error('Error deleting complaint');
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
        
        const res = await fetch(`/api/complaints?role=admin&userId=${auth?.id}`);
        const data = await res.json();
        setComplaints(data.complaints || []);

        const ures = await fetch('/api/admin/users');
        const udata = await ures.json();
        setUsers(udata.users || []);
      } catch {
        setComplaints([]);
      }
    }

    if (auth?.role === "admin") load();
  }, [auth]);

  if (!auth || auth.role !== "admin") {
    return (
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-8"> 
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Access Denied</h2>
        <p className="mt-2 text-gray-400">Please sign in with an admin account.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 p-6 md:p-8 bg-[#111111] border border-white/10 rounded-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-lime-400/5 blur-[80px] rounded-full group-hover:bg-lime-400/10 transition-all duration-700" />
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight relative z-10">Admin Overview</h1>
        <p className="mt-2 text-gray-400 text-sm md:text-base relative z-10">System activity and complaint management dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Users</h3>
          <p className="text-3xl font-black text-white">{stats?.users ?? "0"}</p>
        </div>
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Complaints</h3>
          <p className="text-3xl font-black text-white">{stats?.complaints ?? "0"}</p>
          <div className="mt-4 flex gap-3 text-[10px] font-bold uppercase tracking-tighter">
            <span className="text-lime-400 px-2 py-1 bg-lime-400/10 rounded-lg">Pending: {stats?.complaintsBreakdown?.pending ?? 0}</span>
            <span className="text-gray-400 px-2 py-1 bg-white/5 rounded-lg">Resolved: {stats?.complaintsBreakdown?.resolved ?? 0}</span>
          </div>
        </div>
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Feedback</h3>
          <p className="text-3xl font-black text-white">{stats?.feedback ?? "0"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
             <div className="w-2 h-6 bg-lime-400 rounded-full" />
             User Management
          </h2>
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="p-8 text-center bg-[#111111] border border-white/10 rounded-2xl text-gray-500">No users found</div>
            ) : (
              users.map((u) => (
                <div key={u.email} className="bg-[#111111] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/20">
                  <div>
                    <div className="font-bold text-white tracking-tight">{u.name || '(no name)'}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{u.email} <span className="mx-1">•</span> <span className="text-lime-400">{u.role}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleRole(u.email)} 
                      className="bg-white/5 text-white text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-lg hover:bg-white/10 transition-all active:scale-95 border border-white/10"
                    >
                      Toggle
                    </button>
                    <button 
                      onClick={() => { if (confirm('Delete user ' + u.email + '?')) deleteUser(u.email); }} 
                      className="bg-red-500/10 text-red-400 text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all active:scale-95 border border-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
             <div className="w-2 h-6 bg-lime-400 rounded-full" />
             Complaint Management
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {complaints.length === 0 ? (
               <div className="p-8 text-center bg-[#111111] border border-white/10 rounded-2xl text-gray-500">No complaints available</div>
            ) : (
              complaints.map((c) => (
                <ComplaintCard
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  description={c.description}
                  status={c.status}
                  userEmail={c.userEmail}
                  userPhone={c.userPhone}
                  date={new Date(c.createdAt).toLocaleString()}
                  isAdmin={true}
                  onResolve={async () => {
                    try {
                      const res = await fetch('/api/complaints', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, status: 'resolved' }) });
                      if (!res.ok) throw new Error('Failed');
                      setComplaints((cur) => cur.map((x) => x.id === c.id ? { ...x, status: 'resolved' } : x));
                      toast.success("SMS sent ✅");
                      const s = await fetch('/api/admin/stats'); const sd = await s.json(); setStats(sd.stats || null);
                    } catch (err) {
                      toast.error("Failed to send SMS ❌");
                    }
                  }}
                  onDelete={() => deleteComplaint(c.id)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}

