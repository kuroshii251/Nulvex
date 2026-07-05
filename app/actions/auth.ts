"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL } from "@/lib/supabase/admin";
import { logSecurityEvent } from "@/lib/security-log";

export type AuthState = { error: string } | undefined;

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await logSecurityEvent("login_failed", email, error.message);
    return { error: error.message };
  }

  await logSecurityEvent("login_success", email);

  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    await logSecurityEvent("admin_access_granted", email, "Redirected to /admin/dashboard");
    redirect("/admin/dashboard");
  }

  redirect("/");
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || !email || !password) return { error: "All fields are required." };
  if (username.length < 3) return { error: "Username must be at least 3 characters." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    await logSecurityEvent("login_failed", email, `Signup failed: ${error.message}`);
    return { error: error.message };
  }

  // If user is already registered, identities will be empty
  if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
    return { error: "Email is already registered. Please sign in instead." };
  }

  await logSecurityEvent("signup", email);
  redirect("/login");
}

export async function logout() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.auth.signOut();
  await logSecurityEvent("logout", user?.email);
  redirect("/");
}

export async function resetPassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required." };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  await logSecurityEvent("password_reset_request", email);
  redirect("/login?message=Check+your+email+for+the+password+reset+link");
}