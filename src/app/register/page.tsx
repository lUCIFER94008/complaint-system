"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");
  
  // OTP State
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // 📩 SEND OTP
  async function sendOTP() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep("otp");
      setTimer(30);
      setCanResend(false);
      setMessage("OTP sent to your phone 📱");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // 🔐 VERIFY & REGISTER
  async function onSubmit(e: FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const fullOtp = otpValue.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the full 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          otp: fullOtp,
          role,
          adminCode: role === "admin" ? adminCode : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("Registration successful 🎉 Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multi-char
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-md bg-[#111111] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        {/* Accent Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-lime-400/10 blur-[100px] rounded-full group-hover:bg-lime-400/20 transition-all duration-700" />
        
        <div className="relative z-10">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {step === "form" ? "Get Started" : "Verify Phone"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              {step === "form" 
                ? "Join our professional complaint network." 
                : `We sent a code to ${phone}`}
            </p>
          </header>

          {step === "form" ? (
            <form onSubmit={(e) => { e.preventDefault(); sendOTP(); }} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1.5 block ml-1">Full Name</label>
                  <input required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1.5 block ml-1">Email</label>
                  <input required type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1.5 block ml-1">Phone (+91 format)</label>
                  <input required placeholder="+91 1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1.5 block ml-1">Password</label>
                  <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" />
                </div>
                <div>
                  <label htmlFor="role-select" className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1.5 block ml-1">Account Role</label>
                  <select id="role-select" value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none appearance-none">
                    <option value="user" className="bg-[#111]">Regular User</option>
                    <option value="admin" className="bg-[#111]">Administrator</option>
                  </select>
                </div>

                {role === "admin" && (
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1.5 block ml-1">Admin Access Code</label>
                    <input type="password" required placeholder="Enter secret code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none" />
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-lime-400 text-black font-black py-4 rounded-full hover:bg-lime-300 disabled:opacity-50 transition-all active:scale-95 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] mt-4">
                {loading ? "Requesting OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between gap-2">
                {otpValue.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputs.current[idx] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    aria-label={`OTP digit ${idx + 1}`}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all outline-none"
                  />
                ))}
              </div>

              <div className="text-center space-y-4">
                {canResend ? (
                  <button onClick={sendOTP} className="text-lime-400 text-xs font-black uppercase tracking-widest hover:underline transition-all">Resend Code</button>
                ) : (
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Resend in {timer}s</p>
                )}
              </div>

              <button onClick={onSubmit} disabled={loading} className="w-full bg-lime-400 text-black font-black py-4 rounded-full hover:bg-lime-300 disabled:opacity-50 transition-all active:scale-95 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)]">
                {loading ? "Authenticating..." : "Verify & Register"}
              </button>

              <button onClick={() => setStep("form")} className="block w-full text-center text-gray-600 text-[10px] uppercase font-black tracking-widest hover:text-white transition-colors">Edit contact details</button>
            </div>
          )}

          {/* Feedback */}
          {(message || error) && (
            <div className={`mt-8 p-4 rounded-2xl text-xs font-bold ${error ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-lime-400/10 text-lime-400 border border-lime-400/20'}`}>
              {error || message}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-lime-400 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}