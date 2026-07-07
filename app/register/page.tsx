"use client";

import { signup, type AuthState } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import logo from "../../public/logo.png";
import Image from "next/image";

const T = {
    bg: "#060608",
    card: "#0c0c0f",
    border: "rgba(220,38,38,0.25)",
    borderFocus: "rgba(220,38,38,0.7)",
    red: "#dc2626",
    redGlow: "rgba(220,38,38,0.12)",
    text: "#ffffff",
    muted: "#9ca3af",
    inputBg: "rgba(255,255,255,0.03)",
};

function PasswordStrength({ password }: { password: string }) {
    if (!password) return null;
    const checks = [
        { label: "8+ characters", ok: password.length >= 8 },
        { label: "Uppercase", ok: /[A-Z]/.test(password) },
        { label: "Number", ok: /[0-9]/.test(password) },
        { label: "Symbol", ok: /[^a-zA-Z0-9]/.test(password) },
    ];
    const score = checks.filter(c => c.ok).length;
    const scoreColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
    const scoreLabel = ["Weak", "Fair", "Good", "Strong"];
    return (
        <div className="mt-2 space-y-2">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i < score ? scoreColors[score - 1] : "rgba(255,255,255,0.08)" }} />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: score > 0 ? scoreColors[score - 1] : T.muted }}>{scoreLabel[Math.max(0, score - 1)]}</span>
                <div className="flex gap-2">
                    {checks.map(c => (
                        <span key={c.label} className="text-[10px]" style={{ color: c.ok ? "#22c55e" : "rgba(156,163,175,0.4)" }}>{c.ok ? "✓" : "·"} {c.label}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function GoogleButton() {
    const [loading, setLoading] = useState(false);
    const handleGoogle = async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/api/auth/callback` },
        });
        setLoading(false);
    };
    return (
        <button type="button" onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: T.text }}>
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
            {loading ? "Redirecting..." : "Continue with Google"}
        </button>
    );
}

function RegisterForm() {
    const [state, action, pending] = useActionState<AuthState, FormData>(signup, undefined);
    const [password, setPassword] = useState("");
    const [focused, setFocused] = useState<string | null>(null);

    const inputStyle = (field: string) => ({
        background: T.inputBg,
        border: `1px solid ${focused === field ? T.borderFocus : T.border}`,
        color: T.text,
        outline: "none",
        transition: "border-color 0.2s",
    });

    const fields = [
        { id: "reg-username", name: "username", type: "text", label: "Username", placeholder: "anthony", required: true, minLength: 3 },
        { id: "reg-email", name: "email", type: "email", label: "Email Address", placeholder: "anthony@gmail.com", required: true },
    ];

    return (
        <form action={action} className="space-y-4">
            {fields.map(f => (
                <div key={f.id}>
                    <label htmlFor={f.id} className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: T.muted }}>{f.label}</label>
                    <input id={f.id} name={f.name} type={f.type} required={f.required} minLength={f.minLength}
                        placeholder={f.placeholder}
                        onFocus={() => setFocused(f.id)} onBlur={() => setFocused(null)}
                        className="w-full rounded-xl px-4 py-3 text-sm placeholder-gray-600 font-mono"
                        style={inputStyle(f.id)} />
                </div>
            ))}

            <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: T.muted }}>Password</label>
                <input id="reg-password" name="password" type="password" required minLength={8}
                    placeholder="••••••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                    className="w-full rounded-xl px-4 py-3 text-sm placeholder-gray-600 font-mono"
                    style={inputStyle("password")} />
                <PasswordStrength password={password} />
            </div>

            <div>
                <label htmlFor="reg-confirm" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: T.muted }}>Confirm Password</label>
                <input id="reg-confirm" name="confirmPassword" type="password" required placeholder="••••••••••••"
                    onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)}
                    className="w-full rounded-xl px-4 py-3 text-sm placeholder-gray-600 font-mono"
                    style={inputStyle("confirm")} />
            </div>

            {state?.error && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: T.redGlow, border: `1px solid ${T.border}` }}>
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {state.error}
                </div>
            )}

            <button id="register-submit" type="submit" disabled={pending}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{
                    background: pending ? "rgba(220,38,38,0.5)" : "linear-gradient(135deg, #dc2626, #991b1b)",
                    color: "#fff"
                }}>
                Sign Up
            </button>

            <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{ background: T.border }} />
                <span className="text-xs" style={{ color: T.muted }}>or</span>
                <div className="flex-1 h-px" style={{ background: T.border }} />
            </div>

            <GoogleButton />
        </form>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: T.bg }}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "radial-gradient(circle, #dc2626, transparent)" }} />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #dc2626, transparent)" }} />
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: "linear-gradient(rgba(220,38,38,1) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">


                </div>

                <div className="rounded-2xl p-8" style={{ background: T.card }}>
                    <div className="mb-6">
                        <div className="flex justify-center items-center w-16 h-16 rounded-2xl mb-4 mx-auto">
                            <Image src={logo} alt="logo" width={600} height={600} className="object-contain" />
                        </div>
                        <h2 className="text-xl text-center font-bold" style={{ color: T.text }}>Create Account</h2>
                        <p className="text-sm text-center mt-1" style={{ color: T.muted }}>Register to access threat intelligence</p>
                    </div>

                    <RegisterForm />

                    <p className="text-center text-sm mt-6" style={{ color: T.muted }}>
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-red-600">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
