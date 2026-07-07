"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

// Ganti dengan Form ID Formspree kamu
const FORMSPREE_ID = "your_form_id";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/xjgqjqyo`;

const C = {
    panel: "#0a1019",
    border: "rgba(76,150,255,0.14)",
    borderFocus: "rgba(0,229,255,0.4)",
    cyan: "#00e5ff",
    text: "#e7edf5",
    muted: "#66768a",
    muted2: "#8494a8",
    danger: "#ff4463",
    success: "#4cd97b",
};

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
    const [status, setStatus] = useState<Status>("idle");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            });

            if (res.ok) {
                setStatus("success");
                form.reset();
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error("Contact form error:", err);
            setStatus("error");
        }
    }

    if (status === "success") {
        return (
            <div
                className="rounded-xl border p-6 flex items-start gap-3"
                style={{ background: "rgba(76,217,123,0.06)", borderColor: "rgba(76,217,123,0.25)" }}
            >
                <CheckCircle2 size={20} style={{ color: C.success }} className="shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold" style={{ color: C.text }}>
                        Message sent!
                    </p>
                    <p className="text-xs mt-1" style={{ color: C.muted2 }}>
                        Thank you, I'll reply to your email soon.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted2 }}>
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="Anthony...."
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors border"
                    style={{ background: C.panel, borderColor: C.border, color: C.text }}
                />
            </div>

            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted2 }}>
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="anthony@email.com"
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors border"
                    style={{ background: C.panel, borderColor: C.border, color: C.text }}
                />
            </div>

            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted2 }}>
                    Subject
                </label>
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject..."
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors border"
                    style={{ background: C.panel, borderColor: C.border, color: C.text }}
                />
            </div>

            <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.muted2 }}>
                    Message
                </label>
                <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors border resize-none"
                    style={{ background: C.panel, borderColor: C.border, color: C.text }}
                />
            </div>

            {status === "error" && (
                <div
                    className="rounded-lg border px-3.5 py-2.5 flex items-center gap-2 text-xs"
                    style={{ background: "rgba(255,68,99,0.06)", borderColor: "rgba(255,68,99,0.25)", color: C.danger }}
                >
                    <AlertCircle size={14} className="shrink-0" />
                    Failed to send message. Please try again later.
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex bg-red-600 items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                style={{ color: "white" }}
            >
                {status === "loading" ? (
                    "Mengirim..."
                ) : (
                    <>
                        <Send size={15} />
                        Send Message
                    </>
                )}
            </button>
        </form>
    );
}