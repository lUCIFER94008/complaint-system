"use client";

import { useEffect, useState } from "react";
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
      router.refresh();
      setTimeout(() => router.push('/dashboard'), 1500);
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
    <>
      <div className="mb-8 p-6 md:p-8 bg-[#111111] border border-white/10 rounded-2xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">Submit Complaint</h1>
        <p className="mt-2 text-gray-400 text-sm md:text-base">Help us improve by sharing your feedback or reporting an issue.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
          {!auth ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              </div>
              <p className="text-white font-bold mb-6">Authentication Required</p>
              <div className="flex flex-col gap-3">
                <a href="/login" className="bg-lime-400 text-black font-black py-3 rounded-full hover:bg-lime-300 transition-all">Login</a>
                <a href="/register" className="bg-white/5 text-white font-bold py-3 rounded-full hover:bg-white/10 transition-all border border-white/10">Create Account</a>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label>
                    <input id="fullName" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" />
                 </div>
                 <div>
                    <label htmlFor="emailAddr" className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Email Address</label>
                    <input id="emailAddr" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" />
                 </div>
              </div>

              <div>
                <label htmlFor="complaintTitle" className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Complaint Title</label>
                <input id="complaintTitle" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. System Performance Issue" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" />
              </div>

              <div>
                <label htmlFor="complaintDesc" className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Detailed Description</label>
                <textarea id="complaintDesc" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Please describe the issue in detail..." className="w-full min-h-[160px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none resize-none" />
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm font-bold ${message.includes('submitted') ? 'bg-lime-400/10 text-lime-400' : 'bg-red-500/10 text-red-400'}`}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-lime-400 text-black font-black py-4 rounded-full hover:bg-lime-300 disabled:opacity-50 transition-all duration-300 transform active:scale-95"
              >
                {loading ? "Processing..." : "Submit Complaint"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
