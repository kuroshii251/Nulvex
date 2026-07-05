"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Tag, User, Heart, MessageSquare, Share2, Eye } from "lucide-react";

export interface Post {
  id: string;
  title: string;
  cover_image?: string | null;
  tags?: string[];
  author_username: string;
  read_time: number;
  views: number;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

interface PostCardProps {
  post: Post;
  isLiked?: boolean;
  isLoggedIn?: boolean;
}

export default function PostCard({ post, isLiked = false, isLoggedIn = false }: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("Please login to like this writeup!");
      return;
    }
    if (isLoading) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/writeup/${post.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
    } catch (err) {
      setLiked(!newLiked);
      setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLoading(false);
    }
  };
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/writeup/${post.id}`}
      className="group block rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(135deg, #0a1019 0%, #0d1826 100%)",
        borderColor: "rgba(76,150,255,0.14)",
      }}
    >
      {/* Cover Image */}
      {post.cover_image && (
        <div className="w-full h-44 overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: "rgba(0,229,255,0.08)", color: "#00e5ff" }}
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className="text-base font-bold leading-snug mb-3 line-clamp-2 transition-colors group-hover:text-cyan-400"
          style={{ color: "#e7edf5" }}
        >
          {post.title}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[11px]" style={{ color: "#66768a" }}>
          <span className="flex items-center gap-1">
            <User size={11} />
            {post.author_username}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.read_time} min read
          </span>
          <span className="ml-auto">{date}</span>
        </div>

        {/* Actions / Stats */}
        <div className="mt-4 pt-4 flex items-center justify-between border-t" style={{ borderColor: "rgba(76,150,255,0.1)" }}>
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white" 
              style={{ color: liked ? "#ff4463" : "#8494a8" }}
              onClick={handleLike}
            >
              <Heart size={14} className={liked ? "fill-current text-[#ff4463]" : "text-[#8494a8]"} />
              <span>{likesCount}</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#8494a8" }}>
              <MessageSquare size={14} />
              <span>{post.comments_count || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#8494a8" }}>
              <Eye size={14} />
              <span>{post.views || 0}</span>
            </div>
          </div>
          
          <button 
            className="p-1.5 rounded-md transition-colors hover:bg-white/5" 
            style={{ color: "#8494a8" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const url = `${window.location.origin}/writeup/${post.id}`;
              if (navigator.share) {
                navigator.share({ title: post.title, url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
              }
            }}
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
}
