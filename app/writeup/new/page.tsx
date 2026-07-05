// Server Component wrapper — Header lives here (server only)
import Header from "@/components/header";
import NewWriteupClient from "@/components/writeup/NewWriteupClient";

export const metadata = {
  title: "New Writeup — Nulvex",
  description: "Create and publish a new security writeup.",
};

export default function NewWriteupPage() {
  return (
    <>
      <Header />
      <NewWriteupClient />
    </>
  );
}
