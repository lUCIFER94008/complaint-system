"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [role, setRole] = useState<"user" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 📩 SEND OTP
  async function sendOTP() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep("otp");
      setMessage("OTP sent to your phone 📱");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // 🔐 VERIFY OTP + REGISTER
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          otp,
          role,
          adminCode: role === "admin" ? adminCode : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("Registration successful 🎉");
      setStep("form");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setOtp("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <main className="w-full max-w-lg card-surface p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-white">
          {step === "form" ? "Create account" : "Verify OTP"}
        </h1>

        <p className="mt-1 text-sm text-muted">
          {step === "form"
            ? "Register to submit and track complaints"
            : "Enter the OTP sent to your phone"}
        </p>

        {/* ================= FORM STEP ================= */}
        {step === "form" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendOTP();
            }}
            className="mt-6 space-y-4"
          >
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />

            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />

            {/* 📱 PHONE INPUT */}
            <input
              type="text"
              required
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
            />

            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="input"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {role === "admin" && (
              <input
                type="password"
                placeholder="Admin code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="input"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 rounded-full"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ================= OTP STEP ================= */}
        {step === "otp" && (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input text-center tracking-widest text-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 rounded-full"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              type="button"
              onClick={() => setStep("form")}
              className="text-sm text-gray-400 underline"
            >
              Change phone number
            </button>
          </form>
        )}

        {/* ================= MESSAGES ================= */}
        {message && (
          <div className="mt-4 text-sm text-green-400">{message}</div>
        )}
        {error && (
          <div className="mt-4 text-sm text-red-400">{error}</div>
        )}
      </main>
    </div>
  );
}