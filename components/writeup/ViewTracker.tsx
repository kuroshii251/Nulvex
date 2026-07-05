"use client";

import { useEffect, useRef } from "react";
import { incrementView } from "@/app/actions/writeup";

export default function ViewTracker({ postId }: { postId: string }) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;
    hasIncremented.current = true;
    
    // We fire this asynchronously and don't care about the result
    incrementView(postId).catch(() => {});
  }, [postId]);

  return null;
}
