import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import axios from "axios";
import { Users, ShieldAlert, FileText, TrendingUp } from "lucide-react";
import React from "react";
import { SignupsChart } from "@/components/admin/SignupsChart";

const C = {
    bg: "#05070a",
    panel: "#0a1019",
    border: "rgba(76,150,255,0.14)",
    cyan: "#00e5ff",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
};

export const metadata = {
    title: "Admin Dashboard — Nulvex",
};

function StatCard({
    icon,
    label,
    value,
    accent,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent: string;
}) {
    return (
        <div
            className="rounded-2xl border p-5 flex items-center gap-4"
            style={{ background: C.panel, borderColor: C.border }}
        >
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${accent}18`, color: accent }}
            >
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold" style={{ color: C.text }}>
                    {value}
                </div>
                <div className="text-xs" style={{ color: C.muted }}>
                    {label}
                </div>
            </div>
        </div>
    );
}

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const adminClient = createAdminClient();

    // ── Users ──
    const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers({
        perPage: 1000,
    });

    const allUsers = usersData?.users ?? [];
    const totalUsers = allUsers.length;

    // ── Writeups ──
    const { count: totalPosts } = await supabase
        .from("writeup_posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true);

    // ── CVE count ──
    let totalCves = 0;
    try {
        const cveRes = await axios.get(
            "https://services.nvd.nist.gov/rest/json/cves/2.0",
            {
                params: { resultsPerPage: 1 },
                timeout: 2000,
            }
        );

        totalCves = cveRes.data?.totalResults ?? 0;
    } catch (err) {
        console.error("Failed to fetch CVE total:", err);
    }

    // ── Signups chart (14 hari) ──
    const days = 14;
    const now = new Date();
    const buckets: Record<string, number> = {};

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        buckets[key] = 0;
    }

    for (const u of allUsers) {
        const key = u.created_at?.slice(0, 10);
        if (key && key in buckets) buckets[key]++;
    }

    const chartData = Object.entries(buckets).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        users: count,
    }));

    return (
        <main className="p-8 min-h-screen" style={{ background: "#05070a" }}>
                <div className="mx-auto max-w-6xl">

                    {/* Header */}
                    <div className="mb-8">
                        <p
                            className="font-mono text-xs tracking-widest mb-2"
                            style={{ color: "rgba(0,229,255,0.7)" }}
                        >
                            {"// ADMIN_DASHBOARD"}
                        </p>

                        <h1 className="text-3xl font-bold" style={{ color: C.text }}>
                            Dashboard
                        </h1>

                        <p className="text-sm mt-1" style={{ color: C.muted2 }}>
                            Logged in as {user?.email ?? "Admin"}
                        </p>
                    </div>

                    {/* Error Banner */}
                    {usersError && (
                        <div className="mb-6 px-4 py-3 rounded-xl text-sm border border-red-500/20 bg-red-950/20 text-red-400">
                            Failed to load users: {usersError.message}. Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment variables.
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                        <StatCard
                            icon={<Users size={20} />}
                            label="Total Registered Users"
                            value={totalUsers}
                            accent="#00e5ff"
                        />

                        <StatCard
                            icon={<FileText size={20} />}
                            label="Published Writeups"
                            value={totalPosts ?? 0}
                            accent="#4cd97b"
                        />

                        <StatCard
                            icon={<ShieldAlert size={20} />}
                            label="Total CVEs (NVD)"
                            value={totalCves.toLocaleString("en-US")}
                            accent="#ff8a3d"
                        />
                    </div>

                    {/* Chart */}
                    <div
                        className="rounded-2xl border p-6"
                        style={{ background: C.panel, borderColor: C.border }}
                    >
                        <div className="flex items-center gap-2 mb-5">
                            <TrendingUp size={16} style={{ color: C.cyan }} />
                            <h2 className="text-sm font-bold" style={{ color: C.text }}>
                                New User Signups (Last 14 Days)
                            </h2>
                        </div>

                        <SignupsChart data={chartData} />
                    </div>

                </div>
        </main>
    );
}