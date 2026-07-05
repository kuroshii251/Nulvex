"use client";

import { deletePost } from "@/app/actions/writeup";
import { Trash2 } from "lucide-react";

export default function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form action={deletePost.bind(null, postId)}>
      <button
        type="submit"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80 active:scale-95"
        style={{
          background: "#ff446318",
          color: "#ff4463",
          border: "1px solid #ff446330",
        }}
        onClick={(e) => {
          if (!confirm("Delete this post?")) e.preventDefault();
        }}
      >
        <Trash2 size={11} />
        Delete Post
      </button>
    </form>
  );
}