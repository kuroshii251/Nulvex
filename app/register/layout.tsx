import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register for a CYDEF account to track CVEs, exploits, and security intelligence.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
