import Footer from "@/components/footer/main";
import Header from "@/components/header";
import { Heart, Coffee, ExternalLink } from "lucide-react";

// Ganti dengan username Trakteer kamu
const TRAKTEER_USERNAME = "usernamekamu";
const TRAKTEER_URL = `https://trakteer.id/${TRAKTEER_USERNAME}`;

const C = {
    bg: "#05070a",
    panel: "#0a1019",
    border: "rgba(76,150,255,0.14)",
    cyan: "#00e5ff",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
    red: "#ff5b7a",
};

export const metadata = {
    title: "Donate — Nulvex",
};

export default function DonatePage() {
    return (
        <>
            <Header />
            <main
                className="min-h-screen pt-20 pb-24 px-4 sm:px-6 flex items-center justify-center"
                style={{ background: C.bg }}
            >
                <div
                    className="w-full max-w-md rounded-2xl border p-8 text-center"
                    style={{
                        background: `linear-gradient(135deg, ${C.panel} 0%, #0d1826 100%)`,
                        borderColor: C.border,
                    }}
                >
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        style={{ background: "rgba(255,91,122,0.1)" }}
                    >
                        <Heart size={26} style={{ color: "red" }} />
                    </div>

                    <h1 className="text-2xl font-bold mb-2" style={{ color: C.text }}>
                        Support Nulvex
                    </h1>

                    <p
                        className="text-sm leading-relaxed mb-8"
                        style={{ color: C.muted2 }}
                    >  If any content and writeup here helped you, consider buying me a  coffee. Every support means a lot for keeping this project alive. Thank you!
                    </p>


                    <a href={TRAKTEER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex bg-red-600 items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                        style={{
                            color: "#fff",
                        }}>
                        <Coffee size={16} />
                        Donate
                    </a>

                </div>

            </main >
            <div className="bg-black">
                <Footer />

            </div>

        </>

    );
}