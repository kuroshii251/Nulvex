import Header from "@/components/header";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard, { type Post } from "@/components/writeup/PostCard";
import { PenLine, Rss } from "lucide-react";
import Footer from "@/components/footer/main";


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write Ups",
  description: "Browse community security writeups, CTF solutions, and vulnerability research on CYDEF.",
};

export default async function WriteupPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("writeup_posts")
    .select(`
    id, title, cover_image, tags, author_username, author_avatar_url, read_time, views, created_at,
    writeup_likes(count),
    writeup_comments(count)
  `)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching writeups:", error);
  }

  const typedPosts: Post[] = (posts ?? []).map((p: any) => ({
    ...p,
    likes_count: p.writeup_likes?.[0]?.count ?? 0,
    comments_count: p.writeup_comments?.[0]?.count ?? 0,
  }));

  let likedPostIds = new Set<string>();
  if (user) {
    const { data: likes } = await supabase
      .from("writeup_likes")
      .select("post_id")
      .eq("user_id", user.id);
    likedPostIds = new Set((likes ?? []).map((l) => l.post_id));
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-20" style={{ background: "#05070a" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div
            className="mb-10 pb-6 flex items-start justify-between gap-4"
          >
            <div>

            </div>

            {user && (
              <Link
                href="/writeup/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 flex-shrink-0"
                style={{ background: "red", color: "#000" }}
              >
                <PenLine size={14} />
                New Post
              </Link>
            )}
          </div>

          {/* ── Post Grid ── */}
          {typedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:w-120 place-content-center mx-auto gap-5">
              {typedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isLiked={likedPostIds.has(post.id)}
                  isLoggedIn={!!user}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-24 rounded-2xl border text-center"
              style={{
                background: "linear-gradient(135deg,#0a1019 0%,#0d1826 100%)",
                borderColor: "rgba(76,150,255,0.14)",
              }}
            >
              <Rss size={36} className="mb-4 opacity-30" style={{ color: "#00e5ff" }} />
              <p className="text-sm font-semibold mb-1 text-white">No writeups yet</p>
              <p className="text-xs mb-6" style={{ color: "#66768a" }}>
                Be the first to share your security research with the community.
              </p>
              {user ? (
                <Link
                  href="/writeup/new"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: "#00e5ff", color: "#000" }}
                >
                  <PenLine size={14} />
                  Write the first post
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: "#00e5ff", color: "#000" }}
                >
                  Login to contribute
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="bg-black">
          <Footer />

        </div>
      </main>

    </>
  );
}
