import { useEffect, useState } from "react";
import { useLoaderData, useParams, Link } from "react-router-dom";
import Modal from "~/components/modal";
import { ArrowUpCircle, ArrowDownCircle, ChevronDown, ChevronUp, Info } from "lucide-react";
import { iconMap } from "~/components/icons"

/** ---- Types you can extend as needed ---- */
type ProjectCategory = { name: string; slug: string };
type Project = {
  name: string;
  logo?: string;
  description_short?: string;
  categories?: ProjectCategory[];
  // add other fields from /projects/:slug as you use them
};

type ProjectContent = {
  fundraising?: any[];
  activity?: any[];
  impact?: any[];
  feed?: any[];
  token?: any[];
  // add other fields from /projects/:slug/content as you use them
};

/** ---- SERVER/LOADER fetch: runs on the server if you enable SSR later ---- */
export async function loader({ params }: { params: { slug: string } }) {
  const res = await fetch(`https://api.carboncopy.news/projects/${params.slug}`);
  if (!res.ok) {
    throw new Response("Project not found", { status: res.status });
  }
  const data: Project = await res.json();
  return data;
}

// helpers
const toAmount = (v: unknown): number => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    // remove commas and any non-number chars except . and -
    const cleaned = v.replace(/[^\d.-]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const fmtUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** ---- Page component ---- */
export default function ProjectPage() {
  const data = useLoaderData() as Project; // from loader
  const { slug } = useParams();

  // client-side “content” fetch
  const [content, setContent] = useState<ProjectContent | null>(null);
  const [contentState, setContentState] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setContentState("loading");
    fetch(`https://api.carboncopy.news/projects/${slug}/content`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load content");
        return r.json();
      })
      .then((json) => {
        if (!cancelled) {
          setContent(json);
          setContentState("success");
        }
      })
      .catch(() => {
        if (!cancelled) setContentState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

//   // simple dynamic title without Helmet
//   useEffect(() => {
//     if (data?.name) document.title = `${data.name} | CARBON Copy`;
//   }, [data?.name]);

  return (
    <>
        {/* React 19 native metadata support */}
        <title>{`${data.name} | CARBON Copy`}</title>
        {data.description_short && <meta name="description" content={data.description_short} />}
        {data.description_short && <meta property="og:description" content={data.description_short} />}
        {data.description_short && <meta property="twitter:description" content={data.description_short} />}
        <meta property="og:title" content={`${data.name} | CARBON Copy`} />
        <meta property="twitter:title" content={`${data.name} | CARBON Copy`} />
        <meta property="og:image" content={data.logo} />
        <meta property="twitter:image" content={data.logo} />
        <meta property="og:url" content={data.logo} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
        <meta property="twitter:card" content="summary_card" />
        <meta property="twitter:site" content="@cc_refi_news" />
        
        <div className="p-4">
        {/* Back */}
        <div className="mb-3">
            <button
            onClick={() => window.history.back()}
            className="text-sm text-neutral-600 hover:text-neutral-800 cursor-pointer"
            >
            ← Back
            </button>
        </div>

        {/* 2-column layout on lg+, single column below */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-6">
            {/* Header card */}
            <div className="rounded-lg border bg-white p-4">
                <div className="flex flex-col md:flex-row gap-6">
                    {data?.logo && (
                    <div className="md:w-40 md:flex-shrink-0 flex items-center justify-center">
                        <img
                        src={data.logo}
                        alt={data.name}
                        className="max-h-28 object-contain"
                        loading="lazy"
                        />
                    </div>
                    )}
                    <div className="flex-1">
                    {/* Name + description */}
                    <h1 className="text-2xl font-semibold">{data?.name}</h1>
                    {data?.description_short && (
                        <p className="text-neutral-600 mt-2">{data.description_short}</p>
                    )}

                    {/* Categories */}
                    {data?.categories?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                        {data.categories.map((c) => (
                            <Link
                            key={c.slug}
                            to={`/refi/categories/${c.slug}`}
                            className="inline-block rounded-full bg-blue-600/10 text-blue-700 px-3 py-1 text-xs"
                            >
                            {c.name}
                            </Link>
                        ))}
                        </div>
                    ) : null}

                    {/* Location badge */}
                    {data?.location && (
                        <div className="mt-2">
                        <span className="inline-block rounded-full bg-green-600/10 text-green-700 px-3 py-1 text-xs">
                            {data.location}
                        </span>
                        </div>
                    )}

                    {/* Links row */}
                    {data?.links?.length ? (
                        <div className="mt-3 flex flex-wrap gap-3">
                        {data.links.map((link: any, i: number) => (
                            <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-600 hover:text-neutral-900 text-lg"
                            >
                            {/* Using the icon name as plain text for now */}
                            {iconMap[link.icon.toLowerCase()] ?? link.icon}
                            </a>
                        ))}
                        </div>
                    ) : null}

                    {/* Protocols */}
                    {data?.protocol?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                        {data.protocol.map((p: any, i: number) => (
                            <span
                            key={i}
                            className="inline-block rounded-full bg-purple-600/10 text-purple-700 px-3 py-1 text-xs"
                            >
                            {p.value}
                            </span>
                        ))}
                        </div>
                    ) : null}
                    </div>
                </div>
                </div>
            
            {/* Impact section */}
            <section className="rounded-lg border bg-white p-4">
                <h2 className="text-lg font-semibold mb-4">Impact</h2>

                {contentState === "loading" && <p>Loading impact…</p>}
                {contentState === "error" && (
                    <p className="text-red-600">Failed to load impact.</p>
                )}
                {contentState === "success" && (
                    <>
                    {content?.impact?.length ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {content.impact.map((impact: any, idx: number) => (
                            <div
                            key={idx}
                            className="rounded-lg border shadow-sm bg-white flex flex-col h-full"
                            >
                            {/* Numeric impact */}
                            {impact.type === "numeric" ? (
                                <>
                                    <div className="border-b px-3 py-2 font-medium">
                                        {impact.name}&nbsp;&nbsp;

                                        {impact.details && (
                                            <>
                                                <button
                                                    onClick={() => setOpenId(impact.id)}
                                                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                                >
                                                    <Info size={16} />
                                                </button>

                                                <Modal
                                                    open={openId === impact.id}
                                                    onClose={() => setOpenId(null)}
                                                    title="Note"
                                                    body={impact.details}
                                                    key={impact.id}
                                                ></Modal>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 px-3 py-4 text-3xl font-semibold">
                                        {impact.metric}
                                        <span className="ml-1 text-lg font-normal">
                                        {impact.unit}
                                        </span>
                                    </div>
                                    <div className="border-t px-3 py-2 text-sm text-gray-500">
                                        as of {impact.date}
                                    </div>
                                </>
                            ) : null}

                            {/* Text impact */}
                            {impact.type === "text" ? (
                                <>
                                <div className="px-3 py-3 flex-1">
                                    <span>
                                    {impact.name.length > 200
                                        ? impact.name.slice(0, 200) + "…"
                                        : impact.name}
                                    </span>
                                    
                                    <button
                                        onClick={() => setOpenId(impact.id)}
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                    >
                                        <Info size={16} />
                                    </button>

                                    <Modal
                                        open={openId === impact.id}
                                        onClose={() => setOpenId(null)}
                                        title={impact.name}
                                        body={impact.details}
                                        status={impact.status}
                                        key={impact.id}
                                    ></Modal>
                                    <div className="mt-3">
                                    {impact.status === "Unverified" && (
                                        <span className="inline-block rounded-full bg-gray-200 text-gray-700 text-xs px-2 py-1">
                                        {impact.status}
                                        </span>
                                    )}
                                    {impact.status === "Verified" && (
                                        <span className="inline-block rounded-full bg-green-200 text-green-700 text-xs px-2 py-1">
                                        {impact.status}
                                        </span>
                                    )}
                                    </div>
                                </div>
                                <div className="border-t px-3 py-2 text-sm text-gray-500">
                                    Completed {impact.date}
                                </div>
                                </>
                            ) : null}
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p className="text-neutral-600">No impact data available.</p>
                    )}
                    </>
                )}
                </section>


            {contentState === "success" && content?.activity?.length > 0 && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-2">Activity</h2>

                    <div className="overflow-x-auto">
                    <table className="table-auto w-full border">
                        <thead>
                        <tr className="bg-neutral-100 text-left">
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border w-1/2">Name</th>
                            <th className="p-2 border">Due Date</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {(showAll ? content.activity : content.activity.slice(0, 10)).map(
                            (m: any, idx: number) => (
                            <tr key={idx} className="border-t">
                                <td className="p-2">{m.type}</td>
                                <td className="p-2">{m.name}</td>
                                <td className="p-2">{m.due_date}</td>
                                <td className="p-2">
                                {m.status === "Overdue" && (
                                    <span className="inline-block rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs">
                                    {m.status}
                                    </span>
                                )}
                                {m.status === "In Progress" && (
                                    <span className="inline-block rounded-full bg-gray-200 text-gray-700 px-2 py-0.5 text-xs">
                                    {m.status}
                                    </span>
                                )}
                                {m.status === "Completed" && (
                                    <span className="inline-block rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">
                                    {m.status}
                                    </span>
                                )}
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => setOpenId(m.due_date_unix)}
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                    >
                                        <Info size={16} />
                                    </button>

                                    <Modal
                                        open={openId === m.due_date_unix}
                                        onClose={() => setOpenId(null)}
                                        title={m.name}
                                        body={m.description}
                                        status={m.status}
                                        completed={m.completed_msg}
                                        key={m.due_date_unix}
                                    ></Modal>
                                </td>
                            </tr>
                            )
                        )}
                        </tbody>
                    </table>
                    </div>

                    {content.activity.length > 10 && (
                    <button
                        onClick={() => setShowAll((prev) => !prev)}
                        className="flex items-center mt-3 px-4 py-2 bg-blue-600 gap-1 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        {showAll ? (
                        <>
                            View less <ChevronUp className="w-4 h-4" />
                        </>
                        ) : (
                        <>
                            View more <ChevronDown className="w-4 h-4" />
                        </>
                        )}
                    </button>
                    )}

                    <p className="text-xs text-gray-500 mt-2 text-end">
                    Activity data from{" "}
                    <a
                        href="https://gap.karmahq.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Karma GAP
                    </a>
                    </p>
                </section>
                )}

                {contentState === "loading" && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-2">Activity</h2>
                    <p>Loading activity…</p>
                </section>
                )}

                {contentState === "error" && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-2">Activity</h2>
                    <p className="text-red-600">Failed to load activity.</p>
                </section>
                )}

                {contentState === "success" && !content?.activity?.length && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-2">Activity</h2>
                    <p className="text-neutral-600">No milestones added.</p>
                </section>
                )}

            {contentState === "success" && content?.feed?.length > 0 && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-4">Content</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.feed.map((article: any, idx: number) => (
                        <a
                        key={idx}
                        href={article._path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border rounded-lg hover:shadow-md transition flex flex-col"
                        >
                            {article.mainImage && (
                                <img
                                src={article.mainImage}
                                alt={article.title}
                                className="h-40 w-full object-cover rounded-t-lg"
                                loading="lazy"
                                />
                            )}
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                                    {article.title}
                                </h3>
                                {article.date && (
                                    <p className="text-xs text-gray-500">{article.date}</p>
                                )}
                            </div>
                        </a>
                    ))}
                    </div>
                </section>
                )}

                {contentState === "loading" && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-2">Content</h2>
                    <p>Loading content feed…</p>
                </section>
                )}

                {contentState === "error" && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-2">Content</h2>
                    <p className="text-red-600">Failed to load content feed.</p>
                </section>
                )}


            </div>

            {/* Right column */}
            <aside className="lg:col-span-4 space-y-6">

                {/* Fundraising section */}

            <section className="rounded-lg border bg-white p-4">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold">Fundraising</h2>
                    <>
                        <button
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center justify-center rounded-full p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                            aria-label="View grant data"
                        >
                            <Info className="w-4 h-4" />
                        </button>

                        <Modal
                            open={open}
                            onClose={() => setOpen(false)}
                            title="Grant Data"
                            body={`Our dataset includes the following grant rounds:<br><br>
                            Gitcoin Grants Beta, 18, 19, 20, 21, 22, 23<br>
                            Octant (Epoch 6 & 7)<br>
                            RetroPGF (Round 4)<br>
                            Octant Community Fund<br>
                            Giveth Cumulative (QF matching + donations)`}
                        />
                    </>
                </div>

                {contentState === "loading" && (
                    <div className="flex justify-center my-5">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="sr-only">Loading fundraising data...</span>
                    </div>
                )}

                {contentState === "error" && (
                    <p className="text-red-600">Failed to load fundraising.</p>
                )}

                {contentState === "success" && (
                    <>
                    {!content?.fundraising?.length ? (
                        <p className="text-neutral-600">No fundraising data available.</p>
                    ) : (
                        <table className="table-auto w-full border-collapse border text-sm">
                        <thead>
                            <tr className="bg-neutral-100 text-left">
                                <th className="p-2 border">Type</th>
                                <th className="p-2 border">Amount</th>
                                <th className="p-2 border"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {content.fundraising.map((f: any, idx: number) => (
                            <tr key={idx} className="border-t align-middle">
                                <td className="p-2">{f.funding_type}</td>
                                <td className="p-2">
                                {f.amount === "0.00" ? "Undisclosed" : `$${f.amount}`}
                                </td>
                                <td className="p-2 text-center">
                                    <button
                                        onClick={() => setOpenId(f.amount)}
                                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                    >
                                        <Info size={16} />
                                    </button>

                                    <Modal
                                        open={openId === f.amount}
                                        onClose={() => setOpenId(null)}
                                        title={f.fundingType}
                                        details={f.details}
                                        key={f.amount}
                                    ></Modal>
                                </td>
                            </tr>
                            ))}

                            {/* Total row */}
                            <tr className="border-t font-semibold">
                            <td className="p-2">Total Disclosed</td>
                            <td className="p-2">
                                {(() => {
                                    const total = content.fundraising.reduce(
                                    (sum: number, f: any) => sum + toAmount(f.amount),
                                    0
                                    );
                                    return fmtUSD.format(total);
                                })()}
                            </td>
                            <td className="p-2"></td>
                            </tr>
                        </tbody>
                        </table>
                    )}
                    </>
                )}
                </section>

                <section className="rounded-lg border bg-white p-4">
                <h2 className="text-lg font-semibold mb-4">Founders</h2>

                {!data?.founder?.length ? (
                    <p className="text-neutral-600">No founders added</p>
                ) : (
                    <div className="space-y-4">
                    {data.founder.map((person: any, idx: number) => (
                        <div key={idx}>
                        <span className="font-medium">{person.name}</span>

                        {person.platforms?.length ? (
                            <div className="mt-1 flex gap-4 text-sm text-blue-600">
                            {person.platforms.map((platform: any, pIdx: number) => (
                                <a
                                key={pIdx}
                                href={platform?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                                >
                                {/* icon placeholder as text */}
                                {iconMap[platform.platform.toLowerCase()] ?? platform.platform}
                                </a>
                            ))}
                            </div>
                        ) : (
                            <div className="mt-1">&nbsp;</div>
                        )}
                        </div>
                    ))}
                    </div>
                )}
                </section>

                {contentState === "success" && content?.token?.length > 0 && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-2">Token</h2>

                    <div className="overflow-x-auto">
                    <table className="table-auto w-full text-sm">
                        <tbody>
                        {content.token.map((token: any, idx: number) => (
                            <tr key={idx}>
                                <td className="p-2 font-medium">{token?.symbol}</td>
                                <td className="p-2">${token?.price_usd}</td>
                                <td className="p-2 flex items-center">
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
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </section>
                )}

                {contentState === "loading" && (
                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-2">Token</h2>
                    <p>Loading token…</p>
                </section>
                )}

                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-4">Latest News</h2>

                    {!data?.news?.length ? (
                        <p className="text-neutral-600">No news added</p>
                    ) : (
                        <div className="space-y-4">
                        {data.news.slice(0, 5).map((article: any, idx: number) => (
                            <div key={idx}>
                            <small className="text-gray-500">{article.date}</small>
                            <Link
                                to={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-gray-900 hover:underline"
                            >
                                <p className="font-semibold inline-flex items-center gap-1">
                                {article.headline}
                                </p>
                            </Link>
                            </div>
                        ))}
                        </div>
                    )}
                </section>

                <section className="rounded-lg border bg-white p-4">
                    <h2 className="text-lg font-semibold mb-4">Media Coverage</h2>

                    {!data?.coverage?.length ? (
                        <p className="text-neutral-600">No coverage added</p>
                    ) : (
                        <div className="space-y-4">
                        {data.coverage.map((article: any, idx: number) => (
                            <div key={idx}>
                            <span className="text-gray-700">
                                {article.publication} |{" "}
                                <small className="text-gray-500">{article.date}</small>
                            </span>
                            <Link
                                to={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-gray-900 hover:underline"
                            >
                                <p className="font-semibold inline-flex items-center gap-1">
                                {article.headline}
                                </p>
                            </Link>
                            </div>
                        ))}
                        </div>
                    )}
                </section>
            </aside>
        </div>
        </div>
    </>
  );
}
