import Header from "@/components/header";
import Cvess from "@/components/cves/main";
import GoogleAd from "@/components/ads/GoogleAd";

export const metadata = {
    title: "Latest CVEs — Nulvex",
};

export default function CvesPage() {
    return (
        <>
            <Header />
            <main
                className="min-h-screen pt-20 pb-24 px-4 sm:px-6"
                style={{ background: "#05070a" }}
            >
                <div className="mx-auto max-w-2xl">
                    {/* ── Google AdSense banner (di atas heading) ── */}
                    <div className="mb-6 rounded-xl overflow-hidden" style={{ minHeight: "90px" }}>
                        <GoogleAd adSlot="4049832316" adFormat="auto" fullWidthResponsive />
                    </div>

                    <h1
                        className="text-3xl font-bold mb-6"
                        style={{ color: "#e7edf5" }}
                    >
                        Latest CVEs
                    </h1>
                    <Cvess />
                </div>
            </main>
        </>
    );
}