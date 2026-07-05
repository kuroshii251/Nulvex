import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";

export type SecurityEventType =
    | "login_success"
    | "login_failed"
    | "signup"
    | "admin_access_denied"
    | "admin_access_granted"
    | "logout"
    | "password_reset_request";

export async function logSecurityEvent(
    eventType: SecurityEventType,
    email?: string | null,
    detail?: string
) {
    try {
        const headersList = await headers();
        const ip =
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            headersList.get("x-real-ip") ??
            "unknown";
        const userAgent = headersList.get("user-agent") ?? "unknown";

        const adminClient = createAdminClient();
        await adminClient.from("security_logs").insert({
            event_type: eventType,
            email: email ?? null,
            ip_address: ip,
            user_agent: userAgent,
            detail: detail ?? null,
        });
    } catch (err) {
        // Logging gak boleh sampai bikin request utama gagal
        console.error("Failed to write security log:", err);
    }
}