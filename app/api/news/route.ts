import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/news-service";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    try {
        const articles = await fetchNews({
            query: searchParams.get("q") ?? "cybersecurity",
            max: searchParams.get("max") ?? "10",
        });
        return NextResponse.json(articles);
    } catch {
        return NextResponse.json({ error: "Failed to fetch news data" }, { status: 502 });
    }
}