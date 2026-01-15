import { useEffect, useState } from "react";
import { buildMeta } from "~/root"
import { H1 } from "~/components/ui/h1";
import { apiFetch } from "~/api/client";

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
  url: string;
  headline: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await apiFetch("/news");
        const data = await res
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
          n.headline.toLowerCase().includes(q)
      )
    );
  }, [search, news]);

  return (
    <div className="flex flex-1 flex-col p-4 gap-6 overflow-x-hidden relative">
        <H1>ReFi News</H1>
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-2 py-1 text-md w-full md:w-1/3"
        />

      {filtered.length === 0 ? (
        <p className="text-neutral-500">Loading news...</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {filtered.map((item, idx) => (
            <div key={idx} className="py-4">
              <div className="text-sm text-neutral-500 mb-1">
                {new Date(item.date).toISOString().split("T")[0]}
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg hover:underline"
              >
                {item.headline}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
