"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [auth, setAuth] = useState<{ email?: string; role?: string } | null>(null);

  useEffect(() => {
    try {
      const item = localStorage.getItem("auth");
      if (item) setAuth(JSON.parse(item));
    } catch {
      setAuth(null);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex h-full pt-16">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          auth={auth}
        />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 transition-all duration-300 md:pl-72">
          {children}
        </main>
      </div>
    </div>
  );
}
