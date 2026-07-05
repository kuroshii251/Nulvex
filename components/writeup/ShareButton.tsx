"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ postId, title }: { postId: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/writeup/${postId}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user membatalkan share, abaikan
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 transition-colors hover:text-cyan-400"
      style={{ color: "#66768a" }}
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
    </button>
  );
}