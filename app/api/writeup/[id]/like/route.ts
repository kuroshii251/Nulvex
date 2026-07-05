import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: postId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: existingLike } = await supabase
        .from("writeup_likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

    if (existingLike) {
        const { error } = await supabase
            .from("writeup_likes")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", user.id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ liked: false });
    } else {
        const { error } = await supabase
            .from("writeup_likes")
            .insert({ post_id: postId, user_id: user.id });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ liked: true });
    }
}
