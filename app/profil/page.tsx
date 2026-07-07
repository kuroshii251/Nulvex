import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import ProfileSettingsClient from "@/components/profile/ProfileSettingsClient";
import Footer from "@/components/footer/main";

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
    username: user.user_metadata?.username || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
  };

  return (
    <>
      <Header />
      <ProfileSettingsClient user={profileData} />
      <div className="bg-black">
        <Footer />

      </div>

    </>
  );
}
