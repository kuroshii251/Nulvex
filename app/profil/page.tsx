import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import ProfileSettingsClient from "@/components/profile/ProfileSettingsClient";

export const metadata = {
  title: "Profile Settings — Nulvex",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileData = {
    email: user.email || "",
    username: user.user_metadata?.username || user.email?.split("@")[0] || "User",
    avatar_url: user.user_metadata?.avatar_url || null,
  };

  return (
    <>
      <Header />
      <ProfileSettingsClient user={profileData} />
    </>
  );
}
