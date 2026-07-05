"use client";

import { useActionState, useState } from "react";
import { createPost, type WriteupState } from "@/app/actions/writeup";
import Editor from "@/components/writeup/Editor";
import Link from "next/link";
import { ArrowLeft, Send, ImageIcon, Tag } from "lucide-react";

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

export default function NewWriteupClient() {
  const [state, formAction, pending] = useActionState<WriteupState, FormData>(
    createPost,
    undefined
  );
  const [coverPreview, setCoverPreview] = useState<string>("");

  return (
    <main className="min-h-screen pt-20 pb-20" style={{ background: C.bg }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/writeup"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
            style={{ color: C.muted }}
          >
            <ArrowLeft size={14} />
            Back to Writeups
          </Link>
          <p className="font-mono text-xs tracking-widest" style={{ color: `${C.cyan}99` }}>
            {"// NEW_POST"}
          </p>
        </div>

        <form action={formAction} className="space-y-6">

          {/* ── Title ── */}
          <div>
            <input
              type="text"
              name="title"
              required
              placeholder="Your writeup title…"
              className="w-full bg-transparent outline-none text-3xl font-bold placeholder:font-bold caret-cyan-400"
              style={{
                color: C.text,
                borderBottom: `1px solid ${C.border}`,
                paddingBottom: "12px",
              }}
            />
          </div>

          {/* ── Cover Image ── */}
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ background: C.panel2, border: `1px solid ${C.border}` }}
          >
            <label className="flex items-center gap-2 text-xs font-semibold" style={{ color: C.muted2 }}>
              <ImageIcon size={13} />
              Cover Image <span style={{ color: C.muted }}>(optional)</span>
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
                  setCoverPreview("");
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

          {/* ── Editor ── */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: C.muted2 }}>
              Content
            </label>
            <Editor name="content" placeholder="Start writing your writeup here…" />
          </div>

          {/* ── Tags ── */}
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
              placeholder="e.g. CTF, Web, SQL Injection, XSS"
              className="w-full bg-transparent outline-none text-sm py-1 border-b"
              style={{ color: C.text, borderColor: C.border, caretColor: C.cyan }}
            />
          </div>

          {/* ── Error ── */}
          {state && "error" in state && (
            <div
              className="px-4 py-3 rounded-lg text-sm"
              style={{ background: `${C.danger}18`, color: C.danger, border: `1px solid ${C.danger}44` }}
            >
              {state.error}
            </div>
          )}

          {/* ── Submit ── */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: C.cyan, color: "#000" }}
            >
              <Send size={14} />
              {pending ? "Publishing…" : "Publish Writeup"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
