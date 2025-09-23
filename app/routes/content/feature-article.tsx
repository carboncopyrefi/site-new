import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import fm from "front-matter";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import LinkPreview from "~/components/link-preview";
import remarkGfm from "remark-gfm";
import type { Parent } from "mdast";

const featureFiles = import.meta.glob("../../content/features/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const learnFiles = import.meta.glob("../../content/learn/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const files = {
  features: featureFiles,
  learn: learnFiles,
};

function isExternalUrl(u?: unknown) {
  return typeof u === "string" && /^https?:\/\//i.test(u.trim());
}

export default function FeatureArticle() {
  const { slug } = useParams();
  const location = useLocation();

  const isLearn = location.pathname.includes("/learn");
  const group = isLearn ? "learn" : "features";

  // Grab the relevant file set
  const fileSet = files[group];

  const entry = Object.entries(fileSet).find(([path]) =>
    path.endsWith(`${slug}.md`)
  );

  if (!entry) return <p>Article not found.</p>;

  const [_, content] = entry;
  const parsed = fm(content as string);
  const data = parsed.attributes as any;

  let body = parsed.body.replace("{{Editorial}}", "<hr /> <p>This article represents the opinion of the author(s) and does not necessarily reflect the editorial stance of CARBON Copy.</p>");


  return (
    <>
      {/* React 19 native metadata support */}
      <title>{`${data.title} | CARBON Copy`}</title>
      {data.description && <meta name="description" content={data.description} />}
      {data.description && <meta property="og:description" content={data.description} />}
      {data.description && <meta property="twitter:description" content={data.description} />}
      <meta property="og:title" content={`${data.title} | CARBON Copy`} />
      <meta property="twitter:title" content={`${data.title} | CARBON Copy`} />
      <meta property="og:image" content={`https://carboncopy.news${data.mainImage}`} />
      <meta property="twitter:image" content={`https://carboncopy.news${data.mainImage}`} />
      <meta property="og:url" content={`https://carboncopy.news${location.pathname}`} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content="en_GB" />
      <meta property="twitter:card" content="summary_large_card" />
      <meta property="twitter:site" content="@cc_refi_news" />
      <link rel="canonical" href={`https://carboncopy.news${location.pathname}`} />

      <div className="container mx-auto px-4 py-8 prose prose-img:my-0">
        {/* Back */}
        <div className="mb-3">
            <button
            onClick={() => window.history.back()}
            className="text-sm text-neutral-600 hover:text-neutral-800 cursor-pointer"
            >
            ← Back
            </button>
        </div>
        <span className="text-lg font-semibold text-blue-600 tracking-wide">
          {data.category.toUpperCase()}
        </span>
        <h1 className="mt-4 mb-3">{data.title}</h1>

        {/* description under title */}
        {data.description && (
          <p className="text-lg text-gray-500 mb-2 mt-0">{data.description}</p>
        )}

        <p className="mb-6">
          By{" "}
          {data.author && data.authorSlug ? (
            data.author.split(",").map((name: string, i: number) => {
              const slug = data.authorSlug.split(" ")[i];
              const trimmedName = name.trim();

              return slug ? (
                <React.Fragment key={slug}>
                  <Link
                    to={`../authors/${slug}`}
                    className="text-blue-600 hover:underline no-underline"
                  >
                    {trimmedName}
                  </Link>
                  {i < data.author.split(",").length - 1 && ", "}
                </React.Fragment>
              ) : (
                <span key={trimmedName}>{trimmedName}</span>
              );
            })
          ) : (
            data.author
          )}{" "}
          | {data.date}
        </p>

        <img src={data.mainImage} alt={data.title} />

        {/* markdown with custom link handling */}
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ node, children }: any) => {
              if (
                node?.type === "element" &&
                node.tagName === "p" &&
                node.children?.length === 1
              ) {
                const onlyChild = node.children[0];
                if (onlyChild.type === "element" && onlyChild.tagName === "a") {
                  const href = onlyChild.properties?.href;
                  const text =
                    onlyChild.children?.[0]?.type === "text"
                      ? onlyChild.children[0].value?.trim()
                      : "";

                  if (href && text === href) {
                    // Bare link → replace with preview
                    return <LinkPreview url={href} />;
                  }
                }
              }

              // fallback: normal <p>
              return <p>{children}</p>;
            },

            // normal inline links remain <a ...>
            a: ({ href, children, ...props }: any) => (
              <a {...props} href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {body}
        </Markdown>
      </div>
    </>
  );
}
