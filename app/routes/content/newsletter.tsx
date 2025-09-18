import React, { useEffect, useState } from "react";
import { buildMeta } from "~/root"

interface Newsletter {
  _path: string;
  date: string;
  mainImage: string;
  title: string;
}

const url = "https://carboncopy.news/content/newsletter";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "Newsletter",
      "Subscribe to our periodic newsletter for the latest from the Web3 regenerative finance (ReFi) ecosystem.",
      url,
    )
  ];
};

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.carboncopy.news/newsletter")
      .then((res) => res.json())
      .then((data) => {
        setNewsletters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load newsletters:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading newsletter...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Heading */}
      <h1 className="md:text-[32px] text-[17px] font-[600]">The CARBON Copy Newsletter</h1>

      {/* Cards Grid (3 per row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsletters.map((n, idx) => (
          <a
            key={idx}
            href={n._path}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border rounded-lg shadow hover:shadow-md transition flex flex-col"
          >
            <img
              src={n.mainImage}
              alt={n.title}
              className="h-48 w-full object-cover rounded-t-lg"
            />
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-semibold text-base line-clamp-2">{n.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{n.date}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Embedded Paragraph Widget */}
      <div className="flex justify-center">
        <iframe
          src="https://paragraph.com/@carboncopy/embed"
          width="100%"
          height="360"
          style={{ border: "1px solid #EEE", background: "white" }}
          title="Carbon Copy Newsletter"
        ></iframe>
      </div>
    </div>
  );
}
