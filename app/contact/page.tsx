import Header from "@/components/header";
import ContactForm from "@/components/contact/main";
import { Mail } from "lucide-react";
import Footer from "@/components/footer/main";

const C = {
    bg: "#05070a",
    panel: "#0a1019",
    border: "rgba(76,150,255,0.14)",
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
                        className="w-14 h-14 rounded-2xl flex items-center mx-auto justify-center mb-5"
                        style={{ background: "rgba(0,229,255,0.08)" }}
                    >
                        <Mail size={24} style={{ color: "white" }} />
                    </div>

                    <h1 className="text-3xl text-center font-bold mb-2" style={{ color: C.text }}>
                        Get in Touch
                    </h1>
                    <p className="text-sm text-center leading-relaxed mb-8" style={{ color: C.muted2 }}>
                        Any question, suggestion, or want to collaborate? Fill out the form
                    </p>

                    <ContactForm />
                </div>
            </main>
            <div className="bg-black">
                <Footer />

            </div>

        </>
    );
}