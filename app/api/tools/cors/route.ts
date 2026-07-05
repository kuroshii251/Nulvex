import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });

    try {
        const parsedUrl = new URL(url);
        // Do a simple HEAD or GET request to fetch headers
        const response = await axios.get(parsedUrl.href, { timeout: 5000, validateStatus: () => true });
        
        const allowOrigin = response.headers["access-control-allow-origin"];
        const allowCredentials = response.headers["access-control-allow-credentials"];
        const allowMethods = response.headers["access-control-allow-methods"];

        let status = "Secure";
        if (allowOrigin === "*") status = "Warning: Wildcard Origin Allowed";
        if (allowOrigin && allowOrigin !== "*" && allowCredentials === "true") status = "Vulnerable (Depends on origin reflection)";

        return NextResponse.json({
            url: parsedUrl.href,
            headers: response.headers,
            allowOrigin: allowOrigin || "None",
            allowCredentials: allowCredentials || "None",
            allowMethods: allowMethods || "None",
            analysis: status
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
