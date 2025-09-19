import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import fm from "front-matter";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Mail } from "lucide-react";
import { SiX, SiLinkedin, SiDiscord } from "react-icons/si";

// import authors
const authorFiles = import.meta.glob("../../content/authors/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// import feature articles
const articleFiles = import.meta.glob("../../content/features/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export default function AuthorPage() {
  const { slug } = useParams();
  const location = useLocation();

  // find author file
  const entry = Object.entries(authorFiles).find(([path]) =>
    path.endsWith(`${slug}.md`)
  );

  if (!entry) return <p>Author not found.</p>;

  const [_, content] = entry;
  const parsed = fm(content as string);
  const data = parsed.attributes as any;

  // find past articles by this author
  const articles = Object.entries(articleFiles)
    .map(([path, file]) => {
      const parsedArticle = fm(file as string);
      const attrs = parsedArticle.attributes as any;
      return {
        ...attrs,
        slug: path.split("/").pop()?.replace(".md", ""),
        body: parsedArticle.body,
      };
    })
    .filter((a) => {
      // handle multiple author slugs
      const slugs = (a.authorSlug || "").split(" ");
      return slugs.includes(slug);
    })
    .sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1)); // latest first

  return (
    <>
      {/* React 19 native metadata support */}
      <title>{`${data.title} | CARBON Copy`}</title>
      <meta name="description" content={data.description} />
      <meta property="og:description" content={data.description} />
      <meta property="twitter:description" content={data.description} />
      <meta property="og:title" content={`${data.title} | CARBON Copy`} />
      <meta property="twitter:title" content={`${data.title} | CARBON Copy`} />
      <meta property="og:image" content={`https://carboncopy.news${data.mainImage}`} />
      <meta property="twitter:image" content={`https://carboncopy.news${data.mainImage}`} />
      <meta property="og:url" content={`https://carboncopy.news${location.pathname}`} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />
      <meta property="twitter:card" content="summary_card" />
      <meta property="twitter:site" content="@cc_refi_news" />
      <link rel="canonical" href={`https://carboncopy.news${location.pathname}`} />
      
      <div className="container mx-auto px-4 py-8 prose">

        {/* Author Header */}
        <div className="flex items-start gap-6 mb-0">
          {data.mainImage && (
            <img
              src={data.mainImage}
              alt={data.title}
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="mb-2">{data.title}</h1>
            {data.description && (
              <p className="text-gray-600 text-lg mt-0 mb-4">{data.description}</p>
            )}

            {/* Social Links */}
            <div className="flex gap-4">
              {data.twitter && (
                <a
                  href={data.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <SiX size={22} />
                </a>
              )}
              {data.discord && (
                <a
                  href={data.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:text-indigo-700"
                >
                  <SiDiscord size={22} />
                </a>
              )}
              {data.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <SiLinkedin size={22} />
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="text-red-500 hover:text-red-700"
                >
                  <Mail size={22} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <Markdown rehypePlugins={[rehypeRaw]}>{parsed.body}</Markdown>

        {/* Past Articles */}
        {articles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-0">
              Articles by {data.title}
            </h2>
            <div className="divide-y divide-gray-200">
              {articles.map((article) => (
                <div key={article.slug} className="py-6">
                  <h3 className="text-xl font-medium">{article.title}</h3>
                  <p className="text-gray-500">{article.description}</p>
                  <p className="text-sm text-gray-400 mb-3">{article.date}</p>
                  <Link
                    to={`../features/${article.slug}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition no-underline"
                  >
                    Read Article
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
