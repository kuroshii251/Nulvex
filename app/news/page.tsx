import Footer from "@/components/footer/main";
import Header from "@/components/header";
import NewsCard from "@/components/news/main";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security News",
    description: "Latest cybersecurity news, vulnerability disclosures, and threat intel updates.",
};

function NewsPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#05070a] pt-24 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 pb-6">

                        <h1 className="mt-2 text-3xl text-center font-bold tracking-tight text-white">
                            News<span className="text-cyan-400">.</span>
                        </h1>
                    </div>

                    <NewsCard />

                </div>
                <Footer />

            </main>
        </>
    )
}
export default NewsPage;