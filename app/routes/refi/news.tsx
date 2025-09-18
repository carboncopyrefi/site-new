import { useEffect, useState } from "react";
import { buildMeta } from "~/root"

const url = "https://carboncopy.news/refi/news";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "ReFi News",
      "Read the latest news from the Web3 regenerative finance (ReFi) ecosystem.",
      url,
    )
  ];
};

interface NewsItem {
  company: string;
  date: string;
  link: string;
  title: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("https://api.carboncopy.news/news");
        const data = await res.json();
        setNews(data);
        setFiltered(data);
      } catch (e) {
        console.error("Failed to load news:", e);
      }
    }
    fetchNews();
  }, []);

  // filter on search
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      news.filter(
        (n) =>
          n.company.toLowerCase().includes(q) ||
          n.title.toLowerCase().includes(q)
      )
    );
  }, [search, news]);

  return (
    <div className="flex flex-1 flex-col p-4 overflow-x-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="md:text-[32px] text-[17px] font-[600]">ReFi News</h1>
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500">No news found.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {filtered.map((item, idx) => (
            <div key={idx} className="py-4">
              <div className="text-sm text-neutral-500 mb-1">
                {new Date(item.date).toISOString().split("T")[0]}
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg hover:underline"
              >
                {item.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
