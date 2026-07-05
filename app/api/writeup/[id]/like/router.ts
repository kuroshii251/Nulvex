import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("writeup_posts")
        .select(`
      id, title, cover_image, tags, author_username, read_time, created_at,
      writeup_likes(count),
      writeup_comments(count)
    `)
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const items = (data ?? []).map((p: any) => ({
        ...p,
        likes_count: p.writeup_likes?.[0]?.count ?? 0,
        comments_count: p.writeup_comments?.[0]?.count ?? 0,
    }));

    return NextResponse.json(items);
}