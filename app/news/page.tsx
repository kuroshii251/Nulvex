import Header from "@/components/header";
import NewsCard from "@/components/news/main";

function NewsPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#05070a] pt-24 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 border-b border-cyan-500/15 pb-6">
                        <p className="font-mono text-xs tracking-widest text-cyan-500/70">
                            {"// LIVE_FEED"}
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                            News<span className="text-cyan-400">.</span>
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-gray-500">
                            Latest transmissions, pulled in real time.
                        </p>
                    </div>

                    <NewsCard />
                </div>
            </main>
        </>
    )
}
export default NewsPage;