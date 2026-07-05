"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    if (loading) return;

    setLoading(true);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));

    try {
      const res = await axios.post(`/api/writeup/${postId}/like`);
      setLiked(res.data.liked);
      setCount(res.data.count);
    } catch (err) {
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
      console.error("Failed to toggle like", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1 transition-colors"
      style={{ color: liked ? "#ff4463" : "#66768a" }}
    >
      <Heart size={13} fill={liked ? "#ff4463" : "none"} />
      {count}
    </button>
  );
}