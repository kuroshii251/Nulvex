"use client";

import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/actions/auth";
import { useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { Settings, LogOut } from "lucide-react";

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

    const username = user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "User";

    return (
        <nav className="sticky bg-black">
            <div className="max-w-7xl mx-auto px-7 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Image src={logo} alt="logo" width={600} height={600} />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">NULVEX</span>
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
                    {loading ? (
                        <div className="w-24 h-8" />
                    ) : user ? (
                        <>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all hover:bg-white/5 active:scale-95"
                                    style={{ borderColor: C.borderStrong, color: C.cyan }}
                                >
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden"
                                        style={{ background: "rgba(0,229,255,0.15)", color: C.cyan }}
                                    >
                                        {user?.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
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
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden sm:block px-4 py-2 text-xs font-semibold rounded-md border transition-colors"
                                style={{ borderColor: C.borderStrong, color: C.text }}
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 text-xs font-bold rounded-md transition-transform hover:-translate-y-0.5 bg-red-600"
                            >
                                GET STARTED
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;