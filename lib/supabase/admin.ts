import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        adminKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

export const ADMIN_EMAIL = "diamondg135@gmail.com";