"use client";
import axios from "axios"
import { useEffect, useState } from "react"

type News = {
    id: string;
    title: string;
    url: string;
    description: string;
}

export default function Newss() {
    const [news, setNews] = useState<News[]>([]);
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("https://gnews.io/api/v4/search?q=cybersecurity&apikey=7e33d42681c157828e62ea85dc286344")
                setNews(res.data.articles);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        getData();
    }, [])
    return (
        <>
            {news.map((items) => (
                <div key={items.id}>
                    <h1>{items.title}</h1>
                    <h2></h2>

                </div>
            ))}
        </>
    )
}