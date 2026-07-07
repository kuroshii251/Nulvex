"use client";

import { login, type AuthState } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import logo from "../../public/logo.png";
import Image from "next/image";


const T = {
    bg: "#060608",
    card: "#0c0c0f",
    border: "rgba(220,38,38,0.25)",
    borderFocus: "rgba(220,38,38,0.7)",
    red: "#dc2626",
    redGlow: "rgba(220,38,38,0.15)",
    text: "#ffffff",
    muted: "#9ca3af",
    inputBg: "rgba(255,255,255,0.03)",
};

function GoogleButton({ label }: { label: string }) {
    const [loading, setLoading] = useState(false);

    const handleGoogle = async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/api/auth/callback`,
            },
        });
        setLoading(false);
    };

    return (
        <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: T.text,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
        >
            {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
            )}
            {loading ? "Redirecting..." : label}
        </button>
    );
}

function LoginMessage() {
    const params = useSearchParams();
    const message = params.get("message");
    const error = params.get("error");
    if (!message && !error) return null;
    return (
        <div className={`px-4 py-3 rounded-xl text-sm text-center mb-4 border ${error
            ? "text-red-400 border-red-500/30 bg-red-500/10"
            : "text-green-400 border-green-500/30 bg-green-500/10"}`}>
            {message ?? (error === "auth_callback_failed" ? "Authentication failed. Try again." : error)}
        </div>
    );
}

function LoginForm() {
    const [state, action, pending] = useActionState<AuthState, FormData>(login, undefined);
    const [focused, setFocused] = useState<string | null>(null);

    const inputStyle = (field: string) => ({
        background: T.inputBg,
        border: `1px solid ${focused === field ? T.borderFocus : T.border}`,
        color: T.text,
        outline: "none",
        transition: "border-color 0.2s",
    });

    return (
        <form action={action} className="space-y-4">
            {state?.error && (
                <div className="flex text-red-600 items-start gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: T.redGlow, border: `1px solid ${T.border}` }}>
                    <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {state.error}
                </div>
            )}
            <div>
                <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: T.muted }}>
                    Email Address
                </label>
                <input
                    id="login-email" name="email" type="email" required
                    placeholder="anthony@gmail.com"
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    className="w-full rounded-xl px-4 py-3 text-sm placeholder-gray-600 font-mono"
                    style={inputStyle("email")}
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-widest" style={{ color: T.muted }}>
                        Password
                    </label>
                    <Link href="/forgot-password" className="text-xs transition-colors"
                        onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "0.7"; }}
                        onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; }}>
                        Forgot password?
                    </Link>
                </div>

                <input
                    id="login-password" name="password" type="password" required
                    placeholder="••••••••••••"
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className="w-full rounded-xl px-4 py-3 text-sm placeholder-gray-600 font-mono"
                    style={inputStyle("password")}
                />
            </div>
            <div className="grid grid-cols-2 items-center">
                <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-white text-xs">Remember me</span>
                </label>
                {/* <a href="/forgot-password" className="text-red-600 text-xs text-right">
                    Forgot password?
                </a> */}
            </div>



            <button
                id="login-submit" type="submit" disabled={pending}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{
                    background: pending ? "rgba(220,38,38,0.5)" : "linear-gradient(135deg, #dc2626, #991b1b)",
                    color: "#fff"
                }}>
                {pending ? (
                    <span className="flex items-center justify-center gap-2">
                        Authenticating...
                    </span>
                ) : "Sign In"}
            </button>

            <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{ background: T.border }} />
                <span className="text-xs" style={{ color: T.muted }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: T.border }} />
            </div>

            <GoogleButton label="Sign in with Google" />
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: T.bg }}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: "radial-gradient(circle, #dc2626, transparent)" }} />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]" style={{ background: "radial-gradient(circle, #dc2626, transparent)" }} />
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: "linear-gradient(rgba(220,38,38,1) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(90deg, transparent, #dc2626, transparent)", animation: "none", opacity: 0.6 }} />
            </div>

            <div className="relative w-full max-w-md">

                <div className="rounded-2xl p-8" style={{ background: T.card }}>
                    <div className="flex justify-center items-center w-16 h-16 rounded-2xl mb-4 mx-auto">
                        <Image src={logo} alt="logo" width={600} height={600} className="object-contain" />
                    </div>
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold" style={{ color: T.text }}>Sign In</h2>
                        <p className="text-xs" style={{ color: T.muted }}>Using your account to Sign In</p>
                    </div>
                    <Suspense fallback={null}><LoginMessage /></Suspense>
                    <Suspense fallback={null}><LoginForm /></Suspense>
                    <p className="text-center text-sm mt-6" style={{ color: T.muted }}>
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold transition-colors text-red-600">
                            Sign Up
                        </Link>
                    </p>
                </div>


            </div >
        </div >
    );
}
