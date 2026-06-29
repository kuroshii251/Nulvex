import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const username =
    user.user_metadata?.username ?? user.email?.split("@")[0] ?? "Analyst";

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #030712 0%, #0d1117 50%, #060b14 100%)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderColor: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #06b6d4, #7c3aed)" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span
            className="font-black tracking-widest text-sm"
            style={{
              background: "linear-gradient(90deg, #06b6d4, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NULVEX
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-sm">{username}</span>
          </div>
          <form action={logout}>
            <button
              id="logout-btn"
              type="submit"
              className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-cyan-400 text-sm font-mono tracking-wider mb-1">
            // SECURE SESSION ESTABLISHED
          </p>
          <h1 className="text-4xl font-black text-white">
            Welcome back,{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #06b6d4, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {username}
            </span>
          </h1>
          <p className="text-slate-400 mt-2">
            Your cybersecurity intelligence dashboard is active.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Threats Detected", value: "1,284", icon: "🛡️", color: "#06b6d4", delta: "+12%" },
            { label: "CVEs Tracked", value: "342", icon: "🔍", color: "#7c3aed", delta: "+5%" },
            { label: "Alerts Active", value: "7", icon: "⚡", color: "#f59e0b", delta: "−2" },
            { label: "Scan Coverage", value: "98.7%", icon: "📡", color: "#10b981", delta: "+0.3%" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-5 transition-transform hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs text-emerald-400 font-mono">{stat.delta}</span>
              </div>
              <p
                className="text-3xl font-black"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Info Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Info */}
          <div
            className="rounded-xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Info
            </h3>
            <div className="space-y-3">
              {[
                { label: "Username", value: username },
                { label: "Email", value: user.email },
                {
                  label: "Member since",
                  value: new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  }),
                },
                {
                  label: "Status",
                  value: (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      <span className="text-emerald-400">Active</span>
                    </span>
                  ),
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-500 text-sm">{row.label}</span>
                  <span className="text-slate-200 text-sm font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className="rounded-xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { event: "Login successful", time: "Just now", type: "success" },
                { event: "Security scan completed", time: "5m ago", type: "info" },
                { event: "2 new CVEs detected", time: "1h ago", type: "warning" },
                { event: "Threat feed updated", time: "3h ago", type: "info" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background:
                        item.type === "success"
                          ? "#10b981"
                          : item.type === "warning"
                          ? "#f59e0b"
                          : "#06b6d4",
                    }}
                  />
                  <span className="text-slate-300 text-sm flex-1">{item.event}</span>
                  <span className="text-slate-500 text-xs font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
