"use client";

import { useEffect, useState } from "react";
import ComplaintCard from "@/components/ComplaintCard";

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "inprogress" | "resolved";
  createdAt: string;
};

export default function DashboardPage() {
  const [auth, setAuth] = useState<{ email?: string; role?: string } | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

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
        const res = await fetch("/api/complaints");
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch {
        setComplaints([]);
      }
    }
    load();
  }, []);

  if (!auth) {
    return (
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-8"> 
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Please sign in</h2>
        <p className="mt-2 text-gray-400">Sign in to see your complaints and submit new ones.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 p-6 md:p-8 bg-[#111111] border border-white/10 rounded-2xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">Your Complaints</h1>
        <p className="mt-2 text-gray-400 text-sm md:text-base">A quick overview of your recent submissions and their status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#111111] border border-dashed border-white/10 rounded-2xl text-gray-500">
            No complaints yet — submit one from the sidebar.
          </div>
        ) : (
          complaints.map((c) => (
            <ComplaintCard 
              key={c.id} 
              title={c.title} 
              description={c.description} 
              status={c.status} 
              date={new Date(c.createdAt).toLocaleString()} 
            />
          ))
        )}
      </div>
    </>
  );
}

