import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface Project {
  slug: string;
  name: string;
  short_description: string;
  logo: string;
}

interface Fundraising {
  funding_type: string;
  amount: number;
}

interface Token {
  image: string;
  symbol: string;
  price_usd: number;
  percent_change: number;
  url: string;
}

interface NewsItem {
  title: string;
  link: string;
  date: string;
}

interface CategoryResponse {
  metadata: {
    name: string;
    description: string;
    count: number;
    tokens: string;
  };
  projects: Project[];
  fundraising: Fundraising[];
  news: NewsItem[];
}

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<CategoryResponse | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(
          `https://api.carboncopy.news/projects/categories/${slug}`
        );
        const category = await res.json();
        setData(category);

        if (category.tokens) {
          setLoadingTokens(true);
          const tokenRes = await fetch(
            `https://api.carboncopy.news/projects/categories/tokens?ids=${category.tokens}`
          );
          const tokenData = await tokenRes.json();
          setTokens(tokenData);
        }
      } catch (e) {
        console.error("Failed to load category:", e);
      } finally {
        setLoadingTokens(false);
      }
    }
    fetchCategory();
  }, [slug]);

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <>
      <title>{`${data.metadata.name} | CARBON Copy`}</title>
      {data.metadata.description && <meta name="description" content={data.metadata.description} />}
      {data.metadata.description && <meta property="og:description" content={data.metadata.description} />}
      {data.metadata.description && <meta property="twitter:description" content={data.metadata.description} />}
      <meta property="og:title" content={`${data.metadata.name} | CARBON Copy`} />
      <meta property="twitter:title" content={`${data.metadata.name} | CARBON Copy`} />
      <meta property="og:image" content="https://carboncopy.news/meta.jpg" />
      <meta property="twitter:image" content="https://carboncopy.news/meta.jpg" />
      <meta property="og:url" content="https://carboncopy.news/meta.jpg" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />
      <meta property="twitter:card" content="summary_large_card" />
      <meta property="twitter:site" content="@cc_refi_news" />

      <div className="container mx-auto px-4 py-6">

        {/* Back */}
        <div className="mb-3">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-neutral-600 hover:text-neutral-800 cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{data.metadata.name}</h1>
          <p className="text-lg text-gray-600">{data.metadata.description}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Projects ({data.metadata.count})
            </h2>
            {data.projects.map((p) => (
              <div
                key={p.slug}
                className="mb-4 border rounded-lg overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 md:w-1/5 flex justify-center items-center">
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="max-h-20 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 md:w-4/5">
                    <h5 className="font-bold">{p.name}</h5>
                    <p className="text-sm text-gray-600">{p.short_description}</p>
                    <Link
                      to={`../projects/${p.slug}`}
                      className="mt-2 inline-block text-blue-600 hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Fundraising */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Fundraising</h2>
              <div className="border rounded-lg p-4">
                {data.fundraising?.length ? (
                  data.fundraising.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-1 text-sm"
                    >
                      <span>{item.funding_type}</span>
                      <span>${item.amount}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No fundraising data available
                  </p>
                )}
              </div>
            </div>

            {/* Tokens */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Tokens</h2>
              <div className="border rounded-lg p-4">
                {loadingTokens ? (
                  <p className="text-center text-sm text-gray-500">
                    Loading token data...
                  </p>
                ) : tokens?.length ? (
                  tokens.map((token, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-6 items-center py-1 text-sm"
                    >
                      <img
                        src={token.image}
                        alt={token.symbol}
                        className="w-6 h-6 mx-auto"
                      />
                      <span className="col-span-1 flex items-center">{token.symbol}</span>
                      <span className="col-span-2 flex items-center">${token.price_usd}</span>
                      <span className="col-span-2 flex items-center">
                        {token?.percent_change < 0 ? (
                          <span className="text-red-600 inline-flex items-center gap-1">
                              <ArrowDownCircle className="w-4 h-4" />
                              {token.percent_change}%
                          </span>
                          ) : token?.percent_change > 0 ? (
                          <span className="text-green-600 inline-flex items-center gap-1">
                              <ArrowUpCircle className="w-4 h-4" />
                              {token.percent_change}%
                          </span>
                          ) : (
                          <span>&nbsp;</span>
                          )}
                      </span>
                      {/* <a
                        href={token.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        
                      </a> */}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No token data available
                  </p>
                )}
              </div>
            </div>

            {/* News */}
            <div>
              <h2 className="text-xl font-semibold mb-3">News</h2>
              <div className="border rounded-lg p-4">
                {data.news?.length ? (
                  data.news.map((item, idx) => (
                    <div key={idx} className="py-1 text-sm">
                      <small className="text-gray-500">{item.date}</small>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-semibold text-gray-800 hover:underline"
                      >
                        {item.title}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No news available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
