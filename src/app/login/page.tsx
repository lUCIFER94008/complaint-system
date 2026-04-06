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
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Login failed");
      
      // ✅ Store FULL data including 'id' and 'phone'
      try {
        localStorage.setItem("auth", JSON.stringify(data));
      } catch {}
      
      router.push(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <main className="w-full max-w-md bg-[#111111] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-lime-400/10 blur-[100px] rounded-full group-hover:bg-lime-400/20 transition-all duration-700" />
        
        <div className="relative z-10">
          <header className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-2 text-sm font-medium tracking-tight">Access your complaint management portal.</p>
          </header>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block ml-1">Email Address</label>
              <input 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                required 
                placeholder="your@email.com" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" 
              />
            </div>

            <div>
              <label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block ml-1">Password</label>
              <input 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                required 
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" 
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/10">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-lime-400 text-black font-black py-4 rounded-full hover:bg-lime-300 disabled:opacity-50 transition-all active:scale-95 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)]"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="text-lime-400 hover:underline">Create account</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

