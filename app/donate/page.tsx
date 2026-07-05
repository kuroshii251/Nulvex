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
                        <Heart size={26} style={{ color: C.red }} />
                    </div>

                    <h1 className="text-2xl font-bold mb-2" style={{ color: C.text }}>
                        Support Nulvex
                    </h1>

                    <p
                        className="text-sm leading-relaxed mb-8"
                        style={{ color: C.muted2 }}
                    >
                        Kalau konten dan writeup di sini membantu kamu, pertimbangkan
                        untuk traktir kopi. Setiap dukungan sangat berarti buat
                        keberlangsungan project ini.
                    </p>


                    <a href={TRAKTEER_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                        style={{
                            background: "linear-gradient(135deg, #ff5b7a 0%, #ff8a3d 100%)",
                            color: "#fff",
                        }}>
                        <Coffee size={16} />
                        Traktir di Trakteer
                        <ExternalLink size={14} />
                    </a>

                    <p className="text-[11px] mt-5" style={{ color: C.muted }}>
                        Kamu akan diarahkan ke halaman Trakteer resmi.
                    </p>
                </div>
            </main >
        </>
    );
}