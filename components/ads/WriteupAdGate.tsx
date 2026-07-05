"use client";

import { useState } from "react";
import AdModal from "@/components/ads/AdModal";

export default function WriteupAdGate({ children }: { children: React.ReactNode }) {
    const [adDone, setAdDone] = useState(false);

    if (!adDone) {
        return <AdModal onDone={() => setAdDone(true)} skipAfter={5} />;
    }

    return <>{children}</>;
}
