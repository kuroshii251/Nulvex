import { createClient } from "@/lib/supabase/server";
import { createAdminClient, ADMIN_EMAIL } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { logSecurityEvent } from "@/lib/security-log";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !ADMIN_EMAIL || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await logSecurityEvent("admin_access_denied", user?.email ?? "anonymous", "Attempted admin layout access");
        redirect("/");
    }

    return (
        <div className="flex min-h-screen" style={{ background: "#05070a" }}>
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
}
