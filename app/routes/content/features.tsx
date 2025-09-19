import React, { useEffect, useState } from "react";
import fm from "front-matter";
import { buildMeta } from "~/root"
import { Link } from "react-router-dom";
import { H1 } from "~/components/ui/h1";

const url = "https://carboncopy.news/content/features";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "ReFi Features",
      "Read our in-depth feature articles and interviews about key ReFi concepts, projects, and people.",
      url,
    )
  ];
};

const files = import.meta.glob("../../content/features/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

type Feature = {
  title: string;
  description: string;
  category: string;
  date: string;
  sortDate: string;
  author: string;
  authorSlug: string;
  mainImage: string;
  body: string;
  slug: string;
};

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const parsedFeatures: Feature[] = Object.entries(files).map(([path, content]) => {
    const parsed = fm(content as string);
    const data = parsed.attributes as any;

    // Use filename (e.g., "collaborative-finance.md" → "collaborative-finance")
    const slug = path.split("/").pop()?.replace(".md", "") || "";

    return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        category: data.category || "",
        date: data.date || "",
        sortDate: data.sortDate || "",
        author: data.author || "",
        authorSlug: data.authorSlug || "",
        mainImage: data.mainImage || "",
        body: parsed.body.trim(),
    };
    });

    // sort descending by sortDate
    parsedFeatures.sort((a, b) =>
      new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
    );

    setFeatures(parsedFeatures);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <H1 className="mb-8">Features</H1>

      <div className="divide-y divide-gray-200">
        {features.map((feature, i) => (
          <div key={i} className="py-6">
            <span className="text-xs font-semibold text-blue-600 tracking-wide">
              {feature.category.toUpperCase()}
            </span>
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
              <span className="mx-2">•</span>
              <span>{feature.date}</span>
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
