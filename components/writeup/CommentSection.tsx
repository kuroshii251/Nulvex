"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createComment, deleteComment, updateComment, type CommentState } from "@/app/actions/writeup";
import Link from "next/link";
import { MessageSquare, Send, Lock, User, Trash2, Edit2, X, Save } from "lucide-react";

interface Comment {
  id: string;
  author_id: string;
  author_username: string;
  body: string;
  created_at: string;
}

interface Props {
  postId: string;
  isLoggedIn: boolean;
  currentUserId?: string;
  initialComments: Comment[];
}

const C = {
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

export default function CommentSection({ postId, isLoggedIn, currentUserId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = createComment.bind(null, postId);
  const [state, formAction, pending] = useActionState<CommentState, FormData>(
    boundAction,
    undefined
  );

  // Reset form & add optimistic comment on success
  useEffect(() => {
    if (state && "success" in state) {
      formRef.current?.reset();
      // Refresh comments from server
      fetch(`/api/writeup/${postId}/comments`)
        .then((r) => r.json())
        .then((data: Comment[]) => setComments(data));
    }
  }, [state, postId]);

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeletingId(commentId);
    try {
      const res = await deleteComment(postId, commentId);
      if (res && "error" in res) {
        alert(res.error);
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      alert("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editBody.trim()) return;
    setSavingId(commentId);
    try {
      const res = await updateComment(postId, commentId, editBody);
      if (res && "error" in res) {
        alert(res.error);
      } else {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, body: editBody } : c))
        );
        setEditingId(null);
      }
    } catch (err) {
      alert("Failed to update comment");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="mt-16 border-t pt-10" style={{ borderColor: C.border }}>
      <h2 className="flex items-center gap-2 text-lg font-bold mb-8" style={{ color: C.text }}>
        <MessageSquare size={18} style={{ color: C.cyan }} />
        Comments
        <span
          className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(0,229,255,0.1)", color: C.cyan }}
        >
          {comments.length}
        </span>
      </h2>

      {/* ── Comment Form ── */}
      {isLoggedIn ? (
        <form action={formAction} ref={formRef} className="mb-10">
          <div
            className="rounded-xl p-4"
            style={{ background: C.panel2, border: `1px solid ${C.border}` }}
          >
            <textarea
              name="body"
              rows={4}
              required
              maxLength={2000}
              placeholder="Share your thoughts or ask a question…"
              className="w-full bg-transparent resize-none outline-none text-sm"
              style={{ color: C.text, caretColor: C.cyan }}
            />
            {state && "error" in state && (
              <p className="text-xs mt-2" style={{ color: C.danger }}>
                {state.error}
              </p>
            )}
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={pending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: C.cyan, color: "#000" }}
              >
                <Send size={12} />
                {pending ? "Posting…" : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* ── Login Banner ── */
        <div
          className="mb-10 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
          style={{ background: C.panel2, border: `1px solid ${C.borderStrong}` }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,229,255,0.08)" }}
          >
            <Lock size={20} style={{ color: C.cyan }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>
              Join the conversation
            </p>
            <p className="text-xs" style={{ color: C.muted2 }}>
              You need to be logged in to leave a comment on this writeup.
            </p>
          </div>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 flex-shrink-0"
            style={{ background: C.cyan, color: "#000" }}
          >
            Login to Comment
          </Link>
        </div>
      )}

      {/* ── Comment List ── */}
      {!isLoggedIn ? (
        <div className="text-center py-10 border rounded-xl" style={{ borderColor: C.border, background: "rgba(0,0,0,0.2)" }}>
          <Lock size={32} className="mx-auto mb-3 opacity-30" style={{ color: C.cyan }} />
          <p className="text-sm font-medium" style={{ color: C.text }}>
            Hidden Comments
          </p>
          <p className="text-xs mt-1" style={{ color: C.muted2 }}>
            You must be logged in to view and interact with comments.
          </p>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: C.muted }}>
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const date = new Date(comment.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <div
                key={comment.id}
                className="rounded-xl p-5"
                style={{
                  background: C.panel,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold uppercase"
                    style={{ background: "rgba(0,229,255,0.12)", color: C.cyan }}
                  >
                    {comment.author_username.charAt(0)}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: C.text }}>
                    {comment.author_username}
                  </span>
                  <div className="text-xs ml-auto flex items-center gap-2">
                    <span style={{ color: C.muted }}>{date}</span>
                    {comment.author_id === currentUserId && (
                      <>
                        <button
                          onClick={() => {
                            if (editingId === comment.id) {
                              setEditingId(null);
                            } else {
                              setEditingId(comment.id);
                              setEditBody(comment.body);
                            }
                          }}
                          className="p-1 rounded-md transition-colors hover:bg-white/5"
                          style={{ color: editingId === comment.id ? C.cyan : C.muted2 }}
                          title={editingId === comment.id ? "Cancel Edit" : "Edit Comment"}
                        >
                          {editingId === comment.id ? <X size={13} /> : <Edit2 size={13} />}
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deletingId === comment.id}
                          className="p-1 rounded-md transition-colors hover:bg-white/5 disabled:opacity-50"
                          style={{ color: C.danger }}
                          title="Delete Comment"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingId === comment.id ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm p-3 rounded-lg border focus:border-cyan-500 transition-colors resize-none"
                      style={{ color: C.text, borderColor: C.borderStrong }}
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-white/5"
                        style={{ color: C.muted2 }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={savingId === comment.id || !editBody.trim()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: C.cyan, color: "#000" }}
                      >
                        <Save size={12} />
                        {savingId === comment.id ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: C.muted2 }}>
                    {comment.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
