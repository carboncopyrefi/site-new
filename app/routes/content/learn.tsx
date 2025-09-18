import React, { useEffect, useState } from "react";
import fm from "front-matter";
import { buildMeta } from "~/root"
import { Link } from "react-router-dom";

const url = "https://carboncopy.news/content/learn";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "Learn",
      "Read our educational articles about key ReFi concepts and solutions.",
      url,
    )
  ];
};

const files = import.meta.glob("../../content/learn/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

type Learn = {
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  authorSlug: string;
  mainImage: string;
  body: string;
  slug: string;
};

export default function LearnPage() {
  const [features, setFeatures] = useState<Learn[]>([]);

  useEffect(() => {
    const parsedFeatures: Learn[] = Object.entries(files).map(([path, content]) => {
    const parsed = fm(content as string);
    const data = parsed.attributes as any;

    // Use filename (e.g., "collaborative-finance.md" → "collaborative-finance")
    const slug =
        path
            .split("/")
            .pop()
            ?.replace(/^\d+\./, "") // remove leading "1.", "23.", etc.
            .replace(".md", "") || "";

    return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        category: data.category || "",
        date: data.date || "",
        author: data.author || "",
        authorSlug: data.authorSlug || "",
        mainImage: data.mainImage || "",
        body: parsed.body.trim(),
    };
    });

    setFeatures(parsedFeatures);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="md:text-[32px] text-[17px] font-[600] mb-8">Learn</h1>

      <div className="divide-y divide-gray-200">
        {features.map((feature, i) => (
          <div key={i} className="py-6">
            <h2 className="text-2xl font-bold mt-1 mb-2">{feature.title}</h2>
            <p className="text-gray-600 mb-3">{feature.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>
                By{" "}
                {feature.author && feature.authorSlug ? (
                  feature.author.split(",").map((name: string, i: number) => {
                    const slug = feature.authorSlug.split(" ")[i];
                    const trimmedName = name.trim();
        
                    return slug ? (
                      <React.Fragment key={slug}>
                        <Link
                          to={`../authors/${slug}`}
                          className="text-blue-600 hover:underline no-underline"
                        >
                          {trimmedName}
                        </Link>
                        {i < feature.author.split(",").length - 1 && ", "}
                      </React.Fragment>
                    ) : (
                      <span key={trimmedName}>{trimmedName}</span>
                    );
                  })
                ) : (
                  feature.author
                )}{" "}
              </span>
              <span className="mx-2"></span>
            </div>
            <Link
                to={`./${feature.slug}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
            >
                Read Article
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
