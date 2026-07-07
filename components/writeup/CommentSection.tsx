"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createComment, deleteComment, updateComment, type CommentState } from "@/app/actions/writeup";
import Link from "next/link";
import { MessageSquare, Send, Lock, Trash2, Edit2, X, Save } from "lucide-react";

interface Comment {
  id: string;
  author_id: string;
  author_username: string;
  author_avatar_url?: string | null;
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
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = createComment.bind(null, postId);
  const [state, formAction, pending] = useActionState<CommentState, FormData>(
    boundAction,
    undefined
  );

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
    setDeletingId(commentId);
    setDeleteModalId(null);
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

  const commentToDelete = comments.find((c) => c.id === deleteModalId);

  return (
    <section>
      {deleteModalId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={() => setDeleteModalId(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{
              background: "linear-gradient(135deg,#0d1826 0%,#0a1019 100%)",
              border: `1px solid rgba(255,68,99,0.3)`,
              animation: "modalIn 0.18s cubic-bezier(0.34,1.56,0.64,1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setDeleteModalId(null)}
              className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: C.muted }}
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(255,68,99,0.1)" }}
            >
              <Trash2 size={22} style={{ color: C.danger }} />
            </div>

            <h3 className="text-base font-bold mb-1" style={{ color: C.text }}>
              Delete Comment?
            </h3>
            <p className="text-sm mb-1" style={{ color: C.muted2 }}>
              This action cannot be undone.
            </p>
            {commentToDelete && (
              <p
                className="text-xs mt-3 mb-5 line-clamp-2 rounded-lg px-3 py-2 italic"
                style={{
                  color: C.muted,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.border}`,
                }}
              >
                &ldquo;{commentToDelete.body}&rdquo;
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-white/5"
                style={{ color: C.muted2, border: `1px solid ${C.border}` }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(deleteModalId)}
                disabled={deletingId === deleteModalId}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: C.danger, color: "#fff" }}
              >
                <Trash2 size={14} />
                {deletingId === deleteModalId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <h2 className="flex items-center gap-2 text-lg font-bold mb-8" style={{ color: C.text }}>
        <MessageSquare size={18} style={{ color: "red" }} />
        Comments
        <span
          className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(0,229,255,0.1)", color: "red" }}
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
              style={{ color: C.text, caretColor: "red" }}
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
                style={{ background: "red", color: "#000" }}
              >
                <Send size={12} />
                {pending ? "Posting…" : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div
          className="mb-10 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
          style={{
            background: C.panel2
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,229,255,0.08)" }}
          >
            <Lock size={20} style={{ color: "red" }} />
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
            style={{ background: "red", color: "white" }}
          >
            Login to Comment
          </Link>
        </div>
      )}

      {/* ── Comment List ── */}
      {!isLoggedIn ? (
        <div className="text-center py-10 border rounded-xl" style={{ borderColor: C.border, background: "rgba(0,0,0,0.2)" }}>
          <Lock size={32} className="mx-auto mb-3 opacity-30" style={{ color: "red" }} />
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
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold uppercase overflow-hidden"
                    style={{ background: "rgba(0,229,255,0.12)", color: "red" }}
                  >
                    {comment.author_avatar_url ? (
                      <img src={comment.author_avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      comment.author_username.charAt(0)
                    )}
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
                          style={{ color: editingId === comment.id ? "red" : C.muted2 }}
                          title={editingId === comment.id ? "Cancel Edit" : "Edit Comment"}
                        >
                          {editingId === comment.id ? <X size={13} /> : <Edit2 size={13} />}
                        </button>
                        <button
                          onClick={() => setDeleteModalId(comment.id)}
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
                      className="w-full bg-transparent outline-none text-sm p-3 rounded-lg border focus:border-red-500 transition-colors resize-none"
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
                        style={{ background: "red", color: "#000" }}
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
