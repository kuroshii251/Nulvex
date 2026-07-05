"use server";

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type WriteupState = { error: string } | { success: true; id: string } | undefined;

// ─── Helpers ────────────────────────────────────────────────────────────────

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ─── Create Post ────────────────────────────────────────────────────────────

export async function createPost(
  prevState: WriteupState,
  formData: FormData
): Promise<WriteupState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to create a post." };

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const tagsRaw = (formData.get("tags") as string)?.trim();
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  let cover_image = null;
  const coverFile = formData.get("cover_file") as File | null;
  if (coverFile && coverFile.size > 0) {
    try {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const ext = path.extname(coverFile.name) || ".png";
      const filename = crypto.randomBytes(16).toString("hex") + ext;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "writeups");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      cover_image = `/uploads/writeups/${filename}`;
    } catch (e) {
      return { error: "Failed to upload image." };
    }
  }

  if (!title) return { error: "Title is required." };
  if (!content || content === "<p><br></p>") return { error: "Content cannot be empty." };

  const author_username =
    user.user_metadata?.username ?? user.email?.split("@")[0] ?? "Anonymous";

  const { data, error } = await supabase
    .from("writeup_posts")
    .insert({
      title,
      content,
      cover_image,
      tags,
      author_id: user.id,
      author_username,
      read_time: estimateReadTime(content),
      published: true,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/writeup");
  redirect(`/writeup/${data.id}`);
}

// ─── Delete Post ─────────────────────────────────────────────────────────────

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("writeup_posts")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id);

  revalidatePath("/writeup");
  redirect("/writeup");
}

// ─── Create Comment ──────────────────────────────────────────────────────────

export type CommentState = { error: string } | { success: true } | undefined;

export async function createComment(
  postId: string,
  prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to comment." };

  const body = (formData.get("body") as string)?.trim();
  if (!body) return { error: "Comment cannot be empty." };
  if (body.length > 2000) return { error: "Comment is too long (max 2000 characters)." };

  const author_username =
    user.user_metadata?.username ?? user.email?.split("@")[0] ?? "Anonymous";

  const { error } = await supabase.from("writeup_comments").insert({
    post_id: postId,
    author_id: user.id,
    author_username,
    body,
  });

  if (error) return { error: error.message };

  revalidatePath(`/writeup/${postId}`);
  return { success: true };
}

// ─── Delete Comment ──────────────────────────────────────────────────────────

export async function deleteComment(
  postId: string,
  commentId: string
): Promise<CommentState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to delete a comment." };

  const { error } = await supabase
    .from("writeup_comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/writeup/${postId}`);
  return { success: true };
}

// ─── Update Post ────────────────────────────────────────────────────────────

export async function updatePost(
  postId: string,
  prevState: WriteupState,
  formData: FormData
): Promise<WriteupState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to update a post." };

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const tagsRaw = (formData.get("tags") as string)?.trim();
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  let cover_image = undefined; // undefined means don't update
  const coverFile = formData.get("cover_file") as File | null;
  if (coverFile && coverFile.size > 0) {
    try {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const ext = path.extname(coverFile.name) || ".png";
      const filename = crypto.randomBytes(16).toString("hex") + ext;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "writeups");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      cover_image = `/uploads/writeups/${filename}`;
    } catch (e) {
      return { error: "Failed to upload image." };
    }
  }

  if (!title) return { error: "Title is required." };
  if (!content || content === "<p><br></p>") return { error: "Content cannot be empty." };

  const updateData: any = {
    title,
    content,
    tags,
    read_time: estimateReadTime(content),
  };
  if (cover_image !== undefined) {
    updateData.cover_image = cover_image;
  }

  const { error } = await supabase
    .from("writeup_posts")
    .update(updateData)
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/writeup/${postId}`);
  redirect(`/writeup/${postId}`);
}

// ─── Update Comment ─────────────────────────────────────────────────────────

export async function updateComment(
  postId: string,
  commentId: string,
  body: string
): Promise<CommentState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to edit a comment." };

  if (!body.trim()) return { error: "Comment cannot be empty." };
  if (body.length > 2000) return { error: "Comment is too long." };

  const { error } = await supabase
    .from("writeup_comments")
    .update({ body })
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) return { error: error.message };

  revalidatePath(`/writeup/${postId}`);
  return { success: true };
}

// ─── Increment View ─────────────────────────────────────────────────────────

export async function incrementView(postId: string) {
  const supabase = await createClient();
  // Using an RPC call, this bypasses the need for the user to be the author
  await supabase.rpc("increment_writeup_views", { post_id: postId });
}
