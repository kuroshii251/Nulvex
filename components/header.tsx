"use client";

import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/actions/auth";
import { useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { Settings, LogOut, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Vulnerabilities", href: "/cves" },
    { label: "Write Up", href: "/writeup" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
    { label: "Donate me", href: "/donate" },
];

const C = {
    void: "#000",
    panel: "#0a1019",
    panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)",
    borderStrong: "rgba(76,150,255,0.35)",
    blue: "#3aa9ff",
    cyan: "#00e5ff",
    danger: "#ff4463",
    warning: "#ffb13d",
    ok: "#35d399",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
};

function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const supabase = createClient();

        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const username = user?.user_metadata?.username ?? user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "User";
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

    return (
        <nav className="sticky top-0 z-50 bg-black">
            <div className="max-w-7xl mx-auto px-7 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Image src={logo} alt="logo" width={600} height={600} />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">CYDEF</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-[13.5px] font-medium">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="transition-colors hover:text-cyan-400"
                            style={{ color: C.muted2 }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-3">
                        {loading ? (
                            <div className="w-24 h-8" />
                        ) : user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all hover:bg-white/5 active:scale-95"
                                    style={{ borderColor: C.borderStrong, color: C.cyan }}
                                >
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden"
                                        style={{ background: "rgba(0,229,255,0.15)", color: C.cyan }}
                                    >
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            username.charAt(0)
                                        )}
                                    </span>
                                    {username}
                                </button>

                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg border overflow-hidden z-50 flex flex-col"
                                        style={{ background: C.panel, borderColor: C.border }}
                                    >
                                        <div className="px-4 py-3 border-b" style={{ borderColor: C.borderStrong }}>
                                            <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{username}</p>
                                            <p className="text-xs truncate" style={{ color: C.muted2 }}>{user?.email}</p>
                                        </div>
                                        <Link
                                            href="/profil"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-white/5"
                                            style={{ color: C.text }}
                                        >
                                            <Settings size={14} style={{ color: C.muted2 }} />
                                            Account
                                        </Link>
                                        <form action={logout}>
                                            <button
                                                type="submit"
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-red-500/10 text-left"
                                                style={{ color: C.danger }}
                                            >
                                                <LogOut size={14} />
                                                Logout
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-xs font-semibold rounded-md border transition-colors hover:bg-white/5"
                                    style={{ borderColor: C.borderStrong, color: C.text }}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-xs font-bold rounded-md transition-transform hover:-translate-y-0.5 bg-red-600 text-white"
                                >
                                    GET STARTED
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden flex items-center justify-center w-9 h-9 rounded-md transition-colors hover:bg-white/5 ml-1"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ color: C.text }}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t" style={{ borderColor: C.borderStrong, background: C.panel }}>
                    <div className="px-4 py-3 space-y-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors hover:bg-white/5 hover:text-cyan-400"
                                style={{ color: C.text }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Auth Section */}
                    <div className="px-4 py-4 border-t" style={{ borderColor: C.borderStrong }}>
                        {loading ? (
                            <div className="h-10 w-full animate-pulse bg-white/5 rounded-md" />
                        ) : user ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 mb-2 px-2">
                                    <span
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold uppercase overflow-hidden shrink-0"
                                        style={{ background: "rgba(0,229,255,0.15)", color: C.cyan }}
                                    >
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            username.charAt(0)
                                        )}
                                    </span>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{username}</p>
                                        <p className="text-xs truncate" style={{ color: C.muted2 }}>{user?.email}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/profil"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors hover:bg-white/5"
                                    style={{ color: C.text }}
                                >
                                    <Settings size={16} style={{ color: C.muted2 }} />
                                    Account
                                </Link>
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors hover:bg-red-500/10 text-left"
                                        style={{ color: C.danger }}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex justify-center items-center px-4 py-2.5 text-sm font-semibold rounded-md border transition-colors hover:bg-white/5"
                                    style={{ borderColor: C.borderStrong, color: C.text }}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex justify-center items-center px-4 py-2.5 text-sm font-bold rounded-md transition-transform active:scale-95 bg-red-600 text-white"
                                >
                                    GET STARTED
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Header;