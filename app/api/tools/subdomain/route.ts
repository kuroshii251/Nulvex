import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const domain = req.nextUrl.searchParams.get("domain");
    if (!domain) return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });

    try {
        const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
        
        // Query crt.sh
        const response = await axios.get(`https://crt.sh/?q=%25.${cleanDomain}&output=json`, { timeout: 15000 });
        
        if (!response.data || !Array.isArray(response.data)) {
            return NextResponse.json({ subdomains: [] });
        }

        const uniqueSubdomains = new Set<string>();
        response.data.forEach((cert: any) => {
            const name = cert.name_value.toLowerCase();
            if (name.includes(cleanDomain)) {
                // handle multiline names from crt.sh
                name.split("\n").forEach((n: string) => uniqueSubdomains.add(n));
            }
        });

        return NextResponse.json({
            domain: cleanDomain,
            count: uniqueSubdomains.size,
            subdomains: Array.from(uniqueSubdomains).sort()
        });
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to fetch from certificate transparency logs. Target may be rate-limiting or timing out." }, { status: 500 });
    }
}
