import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });

    try {
        const parsedUrl = new URL(url);
        const response = await axios.get(parsedUrl.href, { timeout: 5000, validateStatus: () => true });
        
        const headers = response.headers;
        const missing = [];
        
        if (!headers["strict-transport-security"]) missing.push("Strict-Transport-Security (HSTS)");
        if (!headers["content-security-policy"]) missing.push("Content-Security-Policy (CSP)");
        if (!headers["x-frame-options"]) missing.push("X-Frame-Options");
        if (!headers["x-content-type-options"]) missing.push("X-Content-Type-Options");

        return NextResponse.json({
            url: parsedUrl.href,
            rawHeaders: headers,
            missingHeaders: missing,
            score: 100 - (missing.length * 25)
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
