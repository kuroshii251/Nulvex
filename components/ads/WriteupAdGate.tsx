"use client";

import { useState } from "react";
import AdModal from "@/components/ads/AdModal";

/**
 * WriteupAdGate — tampilkan AdModal sebelum konten writeup muncul.
 * Setelah user skip/countdown habis, konten anak (children) langsung ditampilkan.
 */
export default function WriteupAdGate({ children }: { children: React.ReactNode }) {
  const [adDone, setAdDone] = useState(false);

  if (!adDone) {
    return <AdModal onDone={() => setAdDone(true)} skipAfter={5} />;
  }

  return <>{children}</>;
}
