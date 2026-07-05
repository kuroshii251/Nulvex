// Server Component wrapper — Header lives here
import Header from "@/components/header";
import ToolsClient from "@/components/tools/ToolsClient";

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000", color: "#e7edf5" }}>
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <ToolsClient />
      </div>
    </div>
  );
}