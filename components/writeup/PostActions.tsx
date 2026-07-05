"use client";

import { useState } from "react";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostActionsProps {
  postId: string;
  initialLiked: boolean;
  initialLikesCount: number;
  commentsCount: number;
  title: string;
  isLoggedIn: boolean;
}

export default function PostActions({
  postId,
  initialLiked,
  initialLikesCount,
  commentsCount,
  title,
  isLoggedIn,
}: PostActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Please login to like this writeup!");
      router.push("/login"); // Adjust route to your login page
      return;
    }
    
    if (isLoading) return;
    
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/writeup/${postId}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle like");
    } catch (err) {
      setLiked(!newLiked);
      setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/writeup/${postId}`;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-6 py-5 mt-4 border-t border-b mb-8" style={{ borderColor: "rgba(76,150,255,0.14)" }}>
      <button 
        onClick={handleLike}
        className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white"
        style={{ color: liked ? "#ff4463" : "#8494a8" }}
      >
        <Heart size={18} className={liked ? "fill-current" : ""} />
        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
      </button>

      <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#8494a8" }}>
        <MessageSquare size={18} />
        {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
      </div>

      <button 
        onClick={handleShare}
        className="flex items-center gap-2 ml-auto text-sm font-semibold transition-colors hover:text-white"
        style={{ color: "#8494a8" }}
      >
        <Share2 size={18} />
        Share
      </button>
    </div>
  );
}
