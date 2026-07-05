import { createAdminClient } from "@/lib/supabase/admin";
import { Users, Mail, Clock, Shield, CheckCircle } from "lucide-react";

const C = {
    bg: "#05070a",
    panel: "#0a1019",
    panel2: "#0d1826",
    border: "rgba(76,150,255,0.14)",
    borderStrong: "rgba(76,150,255,0.35)",
    cyan: "#00e5ff",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
    success: "#4cd97b",
    danger: "#ff4463",
};

export const metadata = { title: "User Management — Nulvex Admin" };

function timeAgo(dateStr: string | null | undefined) {
    if (!dateStr) return "Never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function AdminUsersPage() {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.listUsers({ perPage: 500 });
    const users = data?.users ?? [];

    const sorted = [...users].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const confirmedCount = users.filter(u => u.email_confirmed_at).length;
    const googleCount = users.filter(u => u.app_metadata?.provider === "google").length;

    return (
        <main className="p-8 min-h-screen" style={{ background: C.bg }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <p className="font-mono text-xs tracking-widest mb-2" style={{ color: "rgba(0,229,255,0.7)" }}>// USER_MANAGEMENT</p>
                    <h1 className="text-3xl font-bold" style={{ color: C.text }}>Registered Users</h1>
                    <p className="text-sm mt-1" style={{ color: C.muted2 }}>{users.length} total accounts</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Users", value: users.length, icon: Users, color: C.cyan },
                        { label: "Confirmed", value: confirmedCount, icon: CheckCircle, color: C.success },
                        { label: "Google OAuth", value: googleCount, icon: Shield, color: "#a78bfa" },
                        { label: "Unconfirmed", value: users.length - confirmedCount, icon: Mail, color: "#f59e0b" },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl border p-5 flex items-center gap-4" style={{ background: C.panel, borderColor: C.border }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                                <s.icon size={18} style={{ color: s.color }} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold" style={{ color: C.text }}>{s.value}</div>
                                <div className="text-xs" style={{ color: C.muted }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,68,99,0.08)", border: "1px solid rgba(255,68,99,0.2)", color: C.danger }}>
                        Failed to load users: {error.message}
                    </div>
                )}

                {/* Table */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: C.panel, borderColor: C.border }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b" style={{ borderColor: C.border }}>
                                    {["User", "Email", "Provider", "Joined", "Last Sign In", "Status"].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: C.muted }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((u, i) => {
                                    const username = u.user_metadata?.username || u.user_metadata?.full_name || u.user_metadata?.name || "—";
                                    const avatar = u.user_metadata?.avatar_url;
                                    const provider = u.app_metadata?.provider ?? "email";
                                    const confirmed = !!u.email_confirmed_at;
                                    const initials = username !== "—" ? username.slice(0, 2).toUpperCase() : (u.email?.slice(0, 2).toUpperCase() ?? "??");

                                    return (
                                        <tr key={u.id} className="border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: "rgba(76,150,255,0.06)" }}>
                                            {/* User */}
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    {avatar ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={avatar} alt={username} className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                            style={{ background: `hsl(${(i * 47) % 360}, 60%, 25%)`, color: `hsl(${(i * 47) % 360}, 80%, 80%)` }}>
                                                            {initials}
                                                        </div>
                                                    )}
                                                    <span className="font-semibold whitespace-nowrap" style={{ color: C.text }}>{username}</span>
                                                </div>
                                            </td>
                                            {/* Email */}
                                            <td className="px-5 py-3 font-mono text-xs" style={{ color: C.muted2 }}>{u.email || "—"}</td>
                                            {/* Provider */}
                                            <td className="px-5 py-3">
                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold capitalize"
                                                    style={{ background: provider === "google" ? "rgba(167,139,250,0.12)" : "rgba(0,229,255,0.1)", color: provider === "google" ? "#a78bfa" : C.cyan }}>
                                                    {provider}
                                                </span>
                                            </td>
                                            {/* Joined */}
                                            <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: C.muted }}>{formatDate(u.created_at)}</td>
                                            {/* Last Sign In */}
                                            <td className="px-5 py-3 text-xs whitespace-nowrap" style={{ color: C.muted }}>
                                                {u.last_sign_in_at ? (
                                                    <span title={new Date(u.last_sign_in_at).toLocaleString()}>{timeAgo(u.last_sign_in_at)}</span>
                                                ) : "Never"}
                                            </td>
                                            {/* Status */}
                                            <td className="px-5 py-3">
                                                <span className="flex items-center gap-1.5 text-xs font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: confirmed ? C.success : "#f59e0b" }} />
                                                    <span style={{ color: confirmed ? C.success : "#f59e0b" }}>{confirmed ? "Confirmed" : "Pending"}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && !error && (
                        <div className="text-center py-16 text-sm" style={{ color: C.muted }}>No users found.</div>
                    )}
                </div>
            </div>
        </main>
    );
}
