import React, { useEffect, useState } from "react";
import fm from "front-matter";
import { buildMeta } from "~/root"
import { Link } from "react-router-dom";
import { H1 } from "~/components/ui/h1";

const url = "https://carboncopy.news/content/web3-tooling-series";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "Understanding Web3 Tooling Challenges for ReFi Communities",
      "A research series aimed at understanding the real-world impact of Web3 tooling within ReFi projects.",
      url,
    )
  ];
};

const files = import.meta.glob("../../content/web3-tooling/*.md", {
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
  status: boolean;
};

export default function Web3ToolingPage() {
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
        status: data.status,
    };
    });

    // sort descending by sortDate
    parsedFeatures.sort((a, b) =>
      new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime()
    );

    setFeatures(parsedFeatures);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
            <H1>Understanding Web3 Tooling Challenges for ReFi Communities</H1>
            <p>A joint initiative by CARBON Copy and Greenpill Network Writers Guild</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-4 prose">
                <p>As Regenerative Finance (ReFi) communities experiment with Web3 technologies, questions remain about how these tools function in practice: which ones are used, how they shape coordination, and what obstacles emerge on the ground.</p>
                <p>This research series draws on interviews, surveys, and case studies to understand the real-world impact of Web3 tooling within ReFi projects.</p>
                <p>Though we will map the most cited features and possibilities, our main interest is in documenting the realities of use: how they are integrated into everyday workflows and what barriers may limit their effectiveness.</p>
                <p>The insights will feed into the Local ReFi Toolkit, a resource designed to help communities navigate coordination challenges with practical strategies and infrastructure choices.</p>
                <p>By surfacing patterns and friction points, this work aims to inform better decisions around digital tools and to open discussion about how Web3 tools can improve and what tools may still be needed.</p>
            </div>

            <div className="divide-y">
                {features.map((feature, i) => (
                <div key={i} className="py-6">
                    <h2 className="text-2xl font-bold mt-1 mb-2">{feature.title}</h2>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                    </div>
                    { feature.status ? (
                      <Link
                          to={`./${feature.slug}`}
                          className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                      >
                          Read
                      </Link>
                      ) : (
                        <span className="text-gray-500">Coming {feature.date}</span>
                      )
                    }
                </div>
                ))}
            </div>
            </div>
    </div>
  );
}
