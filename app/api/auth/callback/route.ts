import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as "recovery" | "email" | "signup" | null;
    const next = searchParams.get("next") ?? "/";

    const supabase = await createClient();

    // ─── PKCE flow (password reset, email change) ──────────────────────────
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash });
        if (!error) {
            const redirectTo = type === "recovery" ? "/update-password" : next;
            return NextResponse.redirect(`${origin}${redirectTo}`);
        }
        return NextResponse.redirect(`${origin}/update-password?error=invalid_token`);
    }

    // ─── Auth code exchange (OAuth, magic link) ────────────────────────────
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Auth failed
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
