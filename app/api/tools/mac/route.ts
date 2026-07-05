import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const mac = req.nextUrl.searchParams.get("mac");
    if (!mac) return NextResponse.json({ error: "Missing mac parameter" }, { status: 400 });

    try {
        const cleanMac = mac.replace(/[^a-fA-F0-9]/g, "");
        const response = await axios.get(`https://api.macvendors.com/${cleanMac}`, { timeout: 5000 });
        
        return NextResponse.json({
            mac: mac,
            vendor: response.data
        });
    } catch (e: any) {
        // api.macvendors.com returns 404 for Not Found
        if (e.response?.status === 404) {
            return NextResponse.json({ mac: mac, vendor: "Unknown Vendor (Not Found)" });
        }
        return NextResponse.json({ error: "Failed to query MAC vendor database" }, { status: 500 });
    }
}
