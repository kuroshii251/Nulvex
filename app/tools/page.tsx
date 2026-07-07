// Server Component wrapper — Header lives here
import Footer from "@/components/footer/main";
import Header from "@/components/header";
import ToolsClient from "@/components/tools/ToolsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Tools",
  description: "Free cybersecurity tools including hash generators, encoders, decoders, and DNS lookups.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000", color: "#e7edf5" }}>
      <Header />
      <div className="flex flex-col md:flex-row flex-1 pt-20">
        <ToolsClient />
      </div>
      <Footer />

    </div>
  );
}