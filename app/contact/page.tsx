import Header from "@/components/header";
import ContactForm from "@/components/contact/main";
import { Mail } from "lucide-react";

const C = {
    bg: "#05070a",
    panel: "#0a1019",
    border: "rgba(76,150,255,0.14)",
    cyan: "#00e5ff",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
};

export const metadata = {
    title: "Contact — Nulvex",
};

export default function ContactPage() {
    return (
        <>
            <Header />
            <main
                className="min-h-screen pt-20 pb-24 px-4 sm:px-6"
                style={{ background: C.bg }}
            >
                <div className="mx-auto max-w-lg">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: "rgba(0,229,255,0.08)" }}
                    >
                        <Mail size={24} style={{ color: C.cyan }} />
                    </div>

                    <h1 className="text-3xl font-bold mb-2" style={{ color: C.text }}>
                        Get in Touch
                    </h1>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: C.muted2 }}>
                        Ada pertanyaan, saran, atau mau kolaborasi? Isi form di bawah,
                        aku bakal balas ke email kamu secepatnya.
                    </p>

                    <ContactForm />
                </div>
            </main>
        </>
    );
}