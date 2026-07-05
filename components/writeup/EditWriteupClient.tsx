"use client";

import { useActionState, useState } from "react";
import { updatePost, type WriteupState } from "@/app/actions/writeup";
import Editor from "@/components/writeup/Editor";
import Link from "next/link";
import { ArrowLeft, Save, ImageIcon, Tag } from "lucide-react";

const C = {
  bg: "#05070a",
  panel: "#0a1019",
  panel2: "#0d1826",
  border: "rgba(76,150,255,0.14)",
  borderStrong: "rgba(76,150,255,0.35)",
  cyan: "#00e5ff",
  text: "#e7edf5",
  muted: "#66768a",
  muted2: "#8494a8",
  danger: "#ff4463",
};

interface PostProps {
  id: string;
  title: string;
  content: string;
  cover_image?: string | null;
  tags?: string[];
}

export default function EditWriteupClient({ post }: { post: PostProps }) {
  const boundAction = updatePost.bind(null, post.id);
  const [state, formAction, pending] = useActionState<WriteupState, FormData>(
    boundAction,
    undefined
  );
  
  const [coverPreview, setCoverPreview] = useState<string>(post.cover_image || "");

  return (
    <main className="min-h-screen pt-20 pb-20" style={{ background: C.bg }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/writeup/${post.id}`}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
            style={{ color: C.muted }}
          >
            <ArrowLeft size={14} />
            Back to Post
          </Link>
          <p className="font-mono text-xs tracking-widest" style={{ color: `${C.cyan}99` }}>
            {"// EDIT_POST"}
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <input
              type="text"
              name="title"
              required
              defaultValue={post.title}
              placeholder="Your writeup title…"
              className="w-full bg-transparent outline-none text-3xl font-bold placeholder:font-bold caret-cyan-400"
              style={{
                color: C.text,
                borderBottom: `1px solid ${C.border}`,
                paddingBottom: "12px",
              }}
            />
          </div>

          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ background: C.panel2, border: `1px solid ${C.border}` }}
          >
            <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: C.muted2 }}>
              <ImageIcon size={13} />
              Cover Image <span style={{ color: C.muted }}>(optional, leave empty to keep current)</span>
            </label>
            <input
              type="file"
              name="cover_file"
              accept="image/*"
              className="w-full bg-transparent outline-none text-sm border-b py-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-900 file:text-cyan-400 hover:file:bg-cyan-800"
              style={{
                color: C.text,
                borderColor: C.border,
              }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCoverPreview(URL.createObjectURL(file));
                } else {
                  setCoverPreview(post.cover_image || "");
                }
              }}
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-lg mt-1"
                onError={() => setCoverPreview("")}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: C.muted2 }}>
              Content
            </label>
            <Editor name="content" defaultValue={post.content} placeholder="Start writing your writeup here…" />
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: C.panel2, border: `1px solid ${C.border}` }}
          >
            <label className="flex items-center gap-2 text-xs font-semibold mb-2" style={{ color: C.muted2 }}>
              <Tag size={13} />
              Tags <span style={{ color: C.muted }}>(comma-separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              defaultValue={post.tags?.join(", ")}
              placeholder="e.g. CTF, Web, SQL Injection, XSS"
              className="w-full bg-transparent outline-none text-sm py-1 border-b"
              style={{ color: C.text, borderColor: C.border, caretColor: C.cyan }}
            />
          </div>

          {state && "error" in state && (
            <div
              className="px-4 py-3 rounded-lg text-sm"
              style={{ background: `${C.danger}18`, color: C.danger, border: `1px solid ${C.danger}44` }}
            >
              {state.error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: C.cyan, color: "#000" }}
            >
              <Save size={14} />
              {pending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
