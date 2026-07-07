import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import CommentSection from "@/components/writeup/CommentSection";
import Link from "next/link";
import { Clock, User, Tag, ArrowLeft, Calendar, PenLine, Eye } from "lucide-react";
import DeletePostButton from "@/components/writeup/DeletePostButton";
import PostActions from "@/components/writeup/PostActions";
import ViewTracker from "@/components/writeup/ViewTracker";
import WriteupAdGate from "@/components/ads/WriteupAdGate";
import Footer from "@/components/footer/main";

const C = {
  bg: "#05070a",
  panel: "#0a1019",
  border: "rgba(76,150,255,0.14)",
  borderStrong: "rgba(76,150,255,0.35)",
  cyan: "#00e5ff",
  text: "#e7edf5",
  muted: "#66768a",
  muted2: "#8494a8",
  danger: "#ff4463",
};

interface Post {
  id: string;
  title: string;
  content: string;
  cover_image?: string | null;
  tags?: string[];
  author_id: string;
  author_username: string;
  author_avatar_url?: string | null;
  read_time: number;
  views: number;
  created_at: string;
  writeup_likes?: { count: number }[];
}

interface Comment {
  id: string;
  author_id: string;
  author_username: string;
  body: string;
  created_at: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("writeup_posts")
    .select("title")
    .eq("id", id)
    .single();
  return {
    title: data ? `${data.title} — Nulvex Writeup` : "Writeup — Nulvex",
  };
}

export default async function WriteupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch post + comments + session in parallel
  const [postResult, commentsResult, userResult] = await Promise.all([
    supabase
      .from("writeup_posts")
      .select(`
        *,
        writeup_likes(count)
      `)
      .eq("id", id)
      .eq("published", true)
      .single(),
    supabase
      .from("writeup_comments")
      .select("id, author_id, author_username, author_avatar_url, body, created_at")
      .eq("post_id", id)
      .order("created_at", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  if (postResult.error || !postResult.data) notFound();

  const post = postResult.data as Post;
  const comments: Comment[] = (commentsResult.data ?? []) as Comment[];
  const user = userResult.data?.user;
  const isAuthor = user?.id === post.author_id;

  let isLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from("writeup_likes")
      .select("*")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .single();
    if (like) isLiked = true;
  }

  const likesCount = post.writeup_likes?.[0]?.count ?? 0;

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Header />
      <WriteupAdGate>
        <main className="min-h-screen pt-20 pb-24" style={{ background: C.bg }}>
          <article className="mx-auto max-w-2xl px-4 sm:px-6">

            <Link
              href="/writeup"
              className="inline-flex items-center gap-1.5 text-xs font-medium mb-8 transition-colors hover:text-white"
              style={{ color: C.muted }}
            >
              <ArrowLeft size={14} />
              All Writeups
            </Link>

            {post.cover_image && (
              <div className="w-full h-64 rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: "rgba(0,229,255,0.08)", color: C.cyan }}
                  >
                    <Tag size={9} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6" style={{ color: C.text }}>
              {post.title}
            </h1>

            <div
              className="flex flex-wrap items-center gap-4 text-xs pb-8 mb-8 border-b"
              style={{ color: C.muted, borderColor: C.border }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden"
                  style={{ background: "rgba(0,229,255,0.1)", color: C.cyan }}
                >
                  {post.author_avatar_url ? (
                    <img src={post.author_avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    post.author_username.charAt(0)
                  )}
                </span>
                <span style={{ color: C.muted2 }}>{post.author_username}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.read_time} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {post.views || 0} views
              </span>

              {isAuthor && (
                <div className="ml-auto flex items-center gap-2">
                  <Link
                    href={`/writeup/${post.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80 active:scale-95"
                    style={{
                      background: "rgba(0,229,255,0.08)",
                      color: C.cyan,
                      border: `1px solid rgba(0,229,255,0.2)`,
                    }}
                  >
                    <PenLine size={11} />
                    Edit Post
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              )}
            </div>

            <ViewTracker postId={post.id} />

            <div
              className="prose-render leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <PostActions
              postId={post.id}
              title={post.title}
              initialLiked={isLiked}
              initialLikesCount={likesCount}
              commentsCount={comments.length}
              isLoggedIn={!!user}
            />

            <CommentSection
              postId={post.id}
              isLoggedIn={!!user}
              currentUserId={user?.id}
              initialComments={comments}
            />
          </article>

          <style>{`
          .prose-render { color: #c8d4e3; font-size: 16px; line-height: 1.85; }
          .prose-render h2 { font-size:1.45em; font-weight:700; margin:1.4em 0 0.6em; color:#e7edf5; }
          .prose-render h3 { font-size:1.15em; font-weight:600; margin:1.1em 0 0.5em; color:#e7edf5; }
          .prose-render p  { margin:0.8em 0; }
          .prose-render blockquote {
            border-left:3px solid rgba(0,229,255,0.4);
            margin:1.2em 0; padding:0.6em 1.2em;
            color:#8494a8; font-style:italic;
            background:rgba(0,229,255,0.04); border-radius:0 8px 8px 0;
          }
          .prose-render pre {
            background:rgba(0,0,0,0.5); border-radius:10px;
            padding:1em 1.2em; overflow-x:auto; margin:1.2em 0;
            border: 1px solid rgba(76,150,255,0.14);
          }
          .prose-render code {
            background:rgba(0,0,0,0.35); border-radius:5px;
            padding:0.15em 0.45em; font-family:monospace; font-size:0.87em;
            color:#00e5ff;
          }
          .prose-render pre code { background:none; padding:0; color:#c8d4e3; }
          .prose-render ul  { list-style:disc; padding-left:1.6em; margin:0.8em 0; }
          .prose-render ol  { list-style:decimal; padding-left:1.6em; margin:0.8em 0; }
          .prose-render li  { margin:0.3em 0; }
          .prose-render a   { color:#3aa9ff; text-decoration:underline; }
          .prose-render a:hover { color:#00e5ff; }
          .prose-render hr  { border:none; border-top:1px solid rgba(76,150,255,0.15); margin:2em 0; }
          .prose-render strong { color:#e7edf5; font-weight:700; }
          .prose-render em { color:#8494a8; }
        `}</style>
        </main>
      </WriteupAdGate>
      <div className="bg-black">
        <Footer />

      </div>

    </>
  );
}
