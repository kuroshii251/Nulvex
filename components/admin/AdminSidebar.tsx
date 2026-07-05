"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShieldAlert, LogOut, Activity, ChevronRight, Shield } from "lucide-react";
import { logout } from "@/app/actions/auth";

const T = {
    bg: "#07080a",
    border: "rgba(220,38,38,0.2)",
    borderActive: "rgba(220,38,38,0.5)",
    red: "#dc2626",
    redBright: "#ef4444",
    redGlow: "rgba(220,38,38,0.1)",
    text: "#ffffff",
    muted: "#6b7280",
    muted2: "#9ca3af",
};

const NAV = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Overview & stats" },
    { href: "/admin/user", label: "Users", icon: Users, desc: "Manage accounts" },
    { href: "/admin/log", label: "Security Logs", icon: ShieldAlert, desc: "Audit trail" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r" style={{ background: T.bg, borderColor: T.border }}>
            {/* Logo */}
            <div className="px-5 py-5 border-b" style={{ borderColor: T.border }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #1a0000, #dc2626)", border: "1px solid rgba(220,38,38,0.5)", boxShadow: "0 0 20px rgba(220,38,38,0.3)" }}>
                        <Shield size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-black tracking-widest" style={{ color: T.text }}>
                            NUL<span style={{ color: T.redBright }}>VEX</span>
                        </p>
                        <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: T.muted }}>Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Status indicator */}
            <div className="px-5 py-3 border-b" style={{ borderColor: T.border }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.redBright }} />
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: T.redBright }}>System Online</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 mb-3" style={{ color: T.muted }}>Management</p>
                {NAV.map(({ href, label, icon: Icon, desc }) => {
                    const isActive = pathname === href;
                    return (
                        <Link key={href} href={href}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all group"
                            style={{
                                background: isActive ? T.redGlow : "transparent",
                                color: isActive ? T.text : T.muted,
                                border: `1px solid ${isActive ? T.borderActive : "transparent"}`,
                                boxShadow: isActive ? `0 0 16px rgba(220,38,38,0.15)` : "none",
                            }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: isActive ? "rgba(220,38,38,0.15)" : "rgba(255,255,255,0.04)" }}>
                                <Icon size={14} style={{ color: isActive ? T.redBright : T.muted }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold" style={{ color: isActive ? T.text : T.muted2 }}>{label}</p>
                                <p className="text-[10px]" style={{ color: T.muted }}>{desc}</p>
                            </div>
                            {isActive && <ChevronRight size={12} style={{ color: T.redBright }} />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t" style={{ borderColor: T.border }}>
                <form action={logout}>
                    <button type="submit"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left"
                        style={{ color: T.muted, border: "1px solid transparent" }}
                        onMouseEnter={e => {
                            const el = e.currentTarget;
                            el.style.color = "#ef4444";
                            el.style.background = "rgba(220,38,38,0.08)";
                            el.style.borderColor = "rgba(220,38,38,0.2)";
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget;
                            el.style.color = T.muted;
                            el.style.background = "transparent";
                            el.style.borderColor = "transparent";
                        }}>
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </form>
            </div>
        </aside>
    );
}
