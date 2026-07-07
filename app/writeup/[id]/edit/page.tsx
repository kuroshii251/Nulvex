import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/header";
import EditWriteupClient from "@/components/writeup/EditWriteupClient";
import Footer from "@/components/footer/main";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: "Edit Writeup — Nulvex",
  };
}

export default async function EditWriteupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: post, error } = await supabase
    .from("writeup_posts")
    .select("id, title, content, cover_image, tags, author_id")
    .eq("id", id)
    .single();

  if (error || !post) notFound();

  // Ensure current user is the author
  if (post.author_id !== user.id) {
    redirect(`/writeup/${id}`);
  }

  return (
    <>
      <Header />
      <EditWriteupClient post={post} />
      <div className="bg-black">
        <Footer />

      </div>
    </>
  );
}

