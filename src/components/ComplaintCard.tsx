"use client";

import React from "react";

type Props = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "inprogress" | "resolved";
  date: string;
  userEmail?: string;
  userPhone?: string;
  isAdmin?: boolean;
  onResolve?: () => void;
  onDelete?: () => void;
};

export default function ComplaintCard({ 
  id, 
  title, 
  description, 
  status, 
  date, 
  userEmail, 
  userPhone, 
  isAdmin,
  onResolve, 
  onDelete 
}: Props) {
  const statusInfo = {
    pending: { label: "Pending", classes: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20" },
    inprogress: { label: "In Progress", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    resolved: { label: "Resolved", classes: "bg-lime-400/10 text-lime-400 border-lime-400/20" },
  } as const;

  const s = statusInfo[status];

  return (
    <article className="group bg-[#111111] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-lime-400/50 hover:shadow-[0_0_20px_rgba(163,230,53,0.1)] hover:scale-[1.02]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{title}</h3>
            <p className="text-xs text-gray-400 font-medium">{date}</p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${s.classes}`}>
            {s.label}
          </span>
        </div>

        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
          {description}
        </p>

        <div className="pt-4 border-t border-white/5 space-y-3">
          {userEmail && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-black tracking-widest text-gray-600">User Email</span>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-base opacity-70">📧</span>
                <span className="hover:text-lime-400 transition-colors font-bold tracking-tight">{userEmail}</span>
              </div>
            </div>
          )}
          {userPhone && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-black tracking-widest text-gray-600">User Phone</span>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-base opacity-70">📱</span>
                <span className="hover:text-lime-400 transition-colors font-bold tracking-tight">{userPhone}</span>
              </div>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-2 pt-4">
            <span className="text-[9px] uppercase font-black tracking-widest text-lime-400/50 mb-1">Admin Actions</span>
            <div className="flex items-center gap-2">
              {status !== 'resolved' && onResolve && (
                <button
                  onClick={(e) => { e.stopPropagation(); onResolve(); }}
                  className="flex-1 bg-lime-400 text-black text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-lime-300 transition-all active:scale-95 shadow-[0_0_15px_rgba(163,230,53,0.2)]"
                >
                  Mark as Resolved
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-red-500/20 transition-all active:scale-95"
                >
                  Delete Record
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
