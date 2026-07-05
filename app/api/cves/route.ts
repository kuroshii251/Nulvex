import { NextResponse } from "next/server";
import { fetchCves } from "@/lib/cve-service";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    try {
        const data = await fetchCves({
            resultsPerPage: searchParams.get("limit") ?? "50",
            startIndex: searchParams.get("startIndex") ?? "0",
            keyword: searchParams.get("keyword"),
            light: searchParams.get("light") === "true",
        });
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch CVE data" }, { status: 502 });
    }
}