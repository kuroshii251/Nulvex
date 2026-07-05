import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, ShieldX, LogIn, LogOut, UserPlus, AlertTriangle } from "lucide-react";
import React from "react";

const C = {
    bg: "#05070a",
    panel: "#0a1019",
    border: "rgba(76,150,255,0.14)",
    cyan: "#00e5ff",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
    danger: "#ff4463",
    success: "#4cd97b",
};

export const metadata = {
    title: "Security Logs — Nulvex",
};

type LogEntry = {
    id: string;
    event_type: string;
    email: string | null;
    ip_address: string | null;
    user_agent: string | null;
    detail: string | null;
    created_at: string;
};

const eventConfig: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
> = {
    login_success: {
        label: "Login Success",
        color: C.success,
        icon: <LogIn size={13} />,
    },
    login_failed: {
        label: "Login Failed",
        color: C.danger,
        icon: <ShieldX size={13} />,
    },
    signup: {
        label: "New Signup",
        color: C.cyan,
        icon: <UserPlus size={13} />,
    },
    admin_access_granted: {
        label: "Admin Access Granted",
        color: C.success,
        icon: <ShieldCheck size={13} />,
    },
    admin_access_denied: {
        label: "Admin Access Denied",
        color: C.danger,
        icon: <AlertTriangle size={13} />,
    },
    logout: {
        label: "Logout",
        color: C.muted,
        icon: <LogOut size={13} />,
    },
};

export default async function AdminLogPage() {
    const supabase = await createClient();

    const { data: logs, error } = await supabase
        .from("security_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

    const typedLogs: LogEntry[] = (logs ?? []) as LogEntry[];

    const deniedCount = typedLogs.filter(
        (l) => l.event_type === "admin_access_denied"
    ).length;

    const failedLoginCount = typedLogs.filter(
        (l) => l.event_type === "login_failed"
    ).length;

    return (
        <>
            <main className="p-8 min-h-screen" style={{ background: "#05070a" }}>
                <div className="mx-auto max-w-5xl">

                    <div className="mb-8">
                        <p
                            className="font-mono text-xs tracking-widest mb-2"
                            style={{ color: "rgba(0,229,255,0.7)" }}
                        >
                            {"// SECURITY_LOG"}
                        </p>

                        <h1 className="text-3xl font-bold" style={{ color: C.text }}>
                            Security Logs
                        </h1>

                        <p className="text-sm mt-1" style={{ color: C.muted2 }}>
                            Last {typedLogs.length} events · monitoring auth & admin access
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl text-sm border border-red-500/20 bg-red-950/20 text-red-400">
                            Failed to load security logs: {error.message}. Make sure RLS policies allow reading or `SUPABASE_SERVICE_ROLE_KEY` is configured.
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">

                        <div
                            className="rounded-xl border p-4"
                            style={{ background: C.panel, borderColor: C.border }}
                        >
                            <div className="text-xl font-bold" style={{ color: C.text }}>
                                {typedLogs.length}
                            </div>
                            <div className="text-xs" style={{ color: C.muted }}>
                                Total Events
                            </div>
                        </div>

                        <div
                            className="rounded-xl border p-4"
                            style={{
                                background: C.panel,
                                borderColor: "rgba(255,68,99,0.25)",
                            }}
                        >
                            <div className="text-xl font-bold" style={{ color: C.danger }}>
                                {deniedCount}
                            </div>
                            <div className="text-xs" style={{ color: C.muted }}>
                                Unauthorized Admin Attempts
                            </div>
                        </div>

                        <div
                            className="rounded-xl border p-4"
                            style={{
                                background: C.panel,
                                borderColor: "rgba(255,140,61,0.25)",
                            }}
                        >
                            <div className="text-xl font-bold" style={{ color: "#ff8a3d" }}>
                                {failedLoginCount}
                            </div>
                            <div className="text-xs" style={{ color: C.muted }}>
                                Failed Login Attempts
                            </div>
                        </div>

                    </div>

                    {/* Error */}
                    {error ? (
                        <div
                            className="rounded-2xl border p-6 text-sm"
                            style={{
                                background: C.panel,
                                borderColor: C.border,
                                color: C.danger,
                            }}
                        >
                            Failed to load logs: {error.message}
                        </div>
                    ) : typedLogs.length === 0 ? (
                        <div
                            className="rounded-2xl border p-10 text-center text-sm"
                            style={{
                                background: C.panel,
                                borderColor: C.border,
                                color: C.muted,
                            }}
                        >
                            No security events recorded yet.
                        </div>
                    ) : (
                        <div
                            className="rounded-2xl border overflow-hidden"
                            style={{ background: C.panel, borderColor: C.border }}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">

                                    <thead>
                                        <tr
                                            className="text-left text-[11px] uppercase tracking-wider border-b"
                                            style={{ color: C.muted, borderColor: C.border }}
                                        >
                                            <th className="px-4 py-3 font-semibold">Event</th>
                                            <th className="px-4 py-3 font-semibold">Email</th>
                                            <th className="px-4 py-3 font-semibold">IP Address</th>
                                            <th className="px-4 py-3 font-semibold">Detail</th>
                                            <th className="px-4 py-3 font-semibold">Time</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {typedLogs.map((log) => {
                                            const cfg = eventConfig[log.event_type] ?? {
                                                label: log.event_type,
                                                color: C.muted,
                                                icon: null,
                                            };

                                            return (
                                                <tr
                                                    key={log.id}
                                                    className="border-b"
                                                    style={{ borderColor: "rgba(76,150,255,0.06)" }}
                                                >
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold"
                                                            style={{
                                                                background: `${cfg.color}18`,
                                                                color: cfg.color,
                                                            }}
                                                        >
                                                            {cfg.icon}
                                                            {cfg.label}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3" style={{ color: C.muted2 }}>
                                                        {log.email ?? "—"}
                                                    </td>

                                                    <td
                                                        className="px-4 py-3 font-mono text-xs"
                                                        style={{ color: C.muted2 }}
                                                    >
                                                        {log.ip_address ?? "—"}
                                                    </td>

                                                    <td
                                                        className="px-4 py-3 text-xs max-w-xs truncate"
                                                        style={{ color: C.muted }}
                                                        title={log.detail ?? ""}
                                                    >
                                                        {log.detail ?? "—"}
                                                    </td>

                                                    <td
                                                        className="px-4 py-3 text-xs whitespace-nowrap"
                                                        style={{ color: C.muted }}
                                                    >
                                                        {new Date(log.created_at).toLocaleString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}