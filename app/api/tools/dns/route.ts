import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

export async function GET(req: NextRequest) {
    const domain = req.nextUrl.searchParams.get("domain");
    if (!domain) return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });

    try {
        // Strip protocols and paths if accidental
        const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
        
        const results: any = {};
        
        try { results.A = await dns.resolve(cleanDomain, 'A'); } catch(e) { results.A = []; }
        try { results.AAAA = await dns.resolve(cleanDomain, 'AAAA'); } catch(e) { results.AAAA = []; }
        try { results.MX = await dns.resolve(cleanDomain, 'MX'); } catch(e) { results.MX = []; }
        try { results.TXT = await dns.resolve(cleanDomain, 'TXT'); } catch(e) { results.TXT = []; }
        try { results.CNAME = await dns.resolve(cleanDomain, 'CNAME'); } catch(e) { results.CNAME = []; }

        return NextResponse.json({
            domain: cleanDomain,
            records: results
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
