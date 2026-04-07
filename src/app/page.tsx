"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-lime-400 selection:text-black">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      {/* Sidebar (Mobile drawer only for Home) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        auth={null} 
      />

      <main className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 pt-32 pb-16">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-[#111111] border border-white/10 p-8 md:p-16 lg:p-20 shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-lime-400/10 blur-[120px] rounded-full" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-lime-400 uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400"></span>
              </span>
              Now Database Powered
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-6">
              Streamline your <span className="text-lime-400">Complaints.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mb-10">
              A professional, high-performance platform to register, track, and resolve issues with complete transparency. Built for modern teams and users.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/complaints/submit" 
                className="bg-lime-400 text-black rounded-full px-8 py-4 text-base font-black hover:bg-lime-300 transition-all duration-300 transform hover:scale-105 text-center"
              >
                Submit Complaint
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-white/5 border border-white/10 text-white rounded-full px-8 py-4 text-base font-bold hover:bg-white/10 transition-all duration-300 text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-12 h-12 bg-lime-400/10 rounded-2xl flex items-center justify-center mb-6 text-lime-400 group-hover:bg-lime-400 group-hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="m15 5 3 3"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Real-time submission</h3>
            <p className="text-gray-400 leading-relaxed">Instantly capture and store complaints with a rich, intuitive interface designed for ease of use.</p>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Status Tracking</h3>
            <p className="text-gray-400 leading-relaxed">Follow every step of your issue from "Pending" to "Resolved" with detailed history and live updates.</p>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-400 group-hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Admin Control</h3>
            <p className="text-gray-400 leading-relaxed">Integrated tools for administrators to manage users, collect feedback, and monitor total system health.</p>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-20 py-16 px-8 bg-[#111111] border border-white/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-around gap-12">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-lime-400 transition-all">24h</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Response Time</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-lime-400 transition-all">10k+</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Users Tracked</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-lime-400 transition-all">99%</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Success Rate</div>
            </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-12 border-t border-white/5">
         <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
            {/* LEFT: LOGO */}
            <div className="flex items-center justify-center md:justify-start gap-2.5">
               <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                  <div className="w-4 h-4 bg-black rounded-sm rotate-45" />
               </div>
               <span className="font-black text-xl text-white tracking-tighter">Complaint System</span>
            </div>

            {/* CENTER: COPYRIGHT */}
            <div className="text-center">
               <p className="text-sm text-gray-500 font-medium">
                  © 2026 Designed by{" "}
                  <a 
                    href="https://r7-olive.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lime-400 hover:text-white transition-colors font-bold"
                  >
                    R7
                  </a>
               </p>
            </div>

            {/* RIGHT: LINKS */}
            <div className="flex items-center justify-center md:justify-end gap-10">
               <Link href="#" className="text-sm text-gray-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]">Privacy</Link>
               <Link href="#" className="text-sm text-gray-500 hover:text-white transition-all font-bold uppercase tracking-widest text-[10px]">Terms</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}
