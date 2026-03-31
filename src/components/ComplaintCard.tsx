"use client";

import React from "react";

type Props = {
  id?: string | number;
  title: string;
  description: string;
  status: "pending" | "inprogress" | "resolved";
  date?: string;
  onResolve?: () => Promise<void>;
};

export default function ComplaintCard({ title, description, status, date, onResolve }: Props) {
  const statusInfo = {
    pending: { label: "Pending", classes: "bg-yellow-400 text-black" },
    inprogress: { label: "In Progress", classes: "bg-blue-500 text-white" },
    resolved: { label: "Resolved", classes: "bg-lime-400 text-black" },
  } as const;

  const s = statusInfo[status];

  return (
    <article className="card-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm text-muted-2 line-clamp-3">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${s.classes}`}>{s.label}</span>
          <time className="text-xs text-muted-2">{date}</time>
          {onResolve && status !== 'resolved' ? (
            <button
              onClick={onResolve}
              className="mt-2 rounded-md btn-primary"
            >
              Resolve
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
