"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const C = {
  bg: "#030712",
  panel: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  cyan: "#06b6d4",
  purple: "#a78bfa",
  danger: "#f87171",
  muted: "#64748b",
  text: "#e2e8f0",
};

function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  // Verify we have an active recovery session before letting user update
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setPending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setPending(false);
    } else {
      router.push("/login?message=Password+updated+successfully.+Please+sign+in.");
    }
  };

  // ─── Error / Expired Link State ────────────────────────────────────────────
  if (errorParam || hasSession === false) {
    return (
      <div className="text-center space-y-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "rgba(248,113,113,0.1)" }}
        >
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Link Expired or Invalid</h2>
        <p className="text-sm" style={{ color: C.muted }}>
          Password reset links are single-use and expire after 1 hour.
          Please request a new one.
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3 rounded-xl text-sm font-semibold text-white text-center transition-all"
          style={{ background: "linear-gradient(90deg, #06b6d4, #a78bfa)" }}
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (hasSession === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // ─── Update Password Form ─────────────────────────────────────────────────
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Set New Password</h2>
        <p className="text-sm mt-1" style={{ color: C.muted }}>Please enter your new password below.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-sm"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg text-sm mt-2"
        >
          {pending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}

export default function UpdatePasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #030712 0%, #0d1117 50%, #060b14 100%)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-black tracking-widest"
            style={{ background: "linear-gradient(90deg, #06b6d4, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            NEW PASSWORD
          </h1>
          <p className="text-slate-500 mt-1 text-xs tracking-wider uppercase">Secure your account</p>
        </div>

        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: C.panel,
            backdropFilter: "blur(20px)",
            border: `1px solid ${C.border}`,
            boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            </div>
          }>
            <UpdatePasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
