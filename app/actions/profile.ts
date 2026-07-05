"use server";

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logSecurityEvent } from "@/lib/security-log";

export type ProfileState = { error?: string; success?: boolean; message?: string } | undefined;

// ─── Update Profile Info (Avatar + Username) ────────────────────────────────

export async function updateProfileInfo(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in." };

  const username = (formData.get("username") as string)?.trim();
  const currentUsername = user.user_metadata?.username;
  
  if (!username) return { error: "Username is required." };
  if (username.length < 3) return { error: "Username must be at least 3 characters." };

  let avatar_url = user.user_metadata?.avatar_url;
  const avatarFile = formData.get("avatar_file") as File | null;

  if (avatarFile && avatarFile.size > 0) {
    try {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const ext = path.extname(avatarFile.name) || ".png";
      const filename = crypto.randomBytes(16).toString("hex") + ext;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      avatar_url = `/uploads/avatars/${filename}`;
    } catch (e) {
      return { error: "Failed to upload avatar." };
    }
  }

  // Update Auth Meta Data
  const { error: authError } = await supabase.auth.updateUser({
    data: { username, avatar_url }
  });

  if (authError) return { error: authError.message };

  // Cascade username change if it was changed
  if (username !== currentUsername) {
    // Note: If they have lots of posts, this is slow, but acceptable for simple projects.
    // In production, we'd normally just rely on JOINs instead of denormalizing author_username.
    await supabase.from("writeup_posts").update({ author_username: username }).eq("author_id", user.id);
    await supabase.from("writeup_comments").update({ author_username: username }).eq("author_id", user.id);
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Profile updated successfully." };
}

// ─── Update Email ───────────────────────────────────────────────────────────

export async function updateEmail(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient();
  const email = (formData.get("email") as string)?.trim();
  if (!email) return { error: "Email is required." };

  const { error } = await supabase.auth.updateUser({ email });
  
  if (error) return { error: error.message };
  return { success: true, message: "Verification email sent. Please check your inbox." };
}

// ─── Update Password ────────────────────────────────────────────────────────

export async function updatePassword(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const { error } = await supabase.auth.updateUser({ password });
  
  if (error) return { error: error.message };
  return { success: true, message: "Password updated successfully." };
}

// ─── Delete Account ─────────────────────────────────────────────────────────

export async function deleteAccount(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in." };

  const confirmEmail = formData.get("confirmEmail") as string;
  if (confirmEmail !== user.email) {
    return { error: "Email does not match." };
  }

  const { error } = await supabase.rpc("delete_user");
  
  if (error) {
    return { error: error.message };
  }

  await logSecurityEvent("account_deleted", user.email || "");
  await supabase.auth.signOut();
  redirect("/");
}
