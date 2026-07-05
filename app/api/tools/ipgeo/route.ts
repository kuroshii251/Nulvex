import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    let ip = req.nextUrl.searchParams.get("ip") || "";
    
    // Auto detect if empty
    if (!ip) {
        ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "8.8.8.8";
        if (ip.includes(",")) ip = ip.split(",")[0].trim();
    }

    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 5000 });
        return NextResponse.json(response.data);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
