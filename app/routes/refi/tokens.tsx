import { useEffect, useState } from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { buildMeta } from "~/root"
import { H1 } from "~/components/ui/h1";

const url = "https://carboncopy.news/refi/tokens";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "ReFi Tokens",
      "A curated list of fungible tokens launched by Web3 regenerative finance (ReFi) projects.",
      url,
    )
  ];
};

type Token = {
  logo: string | null;
  percent_change: number | null;
  price_usd: number;
  project: string;
  slug: string;
  symbol: string;
  token_id: string;
  url: string | null;
};

export default function Tokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"project" | "percent_change">("project");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function fetchTokens() {
      const res = await fetch("https://api.carboncopy.news/tokens");
      const data = await res.json();
      setTokens(data.tokens);
      setFilteredTokens(data.tokens);
    }
    fetchTokens();
  }, []);

  // search
  useEffect(() => {
    let filtered = tokens.filter(
      (t) =>
        t.project.toLowerCase().includes(search.toLowerCase()) ||
        t.symbol.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [search, tokens]);

  // sorting
  function sortBy(key: "project" | "percent_change") {
    let dir: "asc" | "desc" = sortDir;
    if (key === sortKey) {
      dir = dir === "asc" ? "desc" : "asc"; // toggle
    } else {
      dir = "asc"; // reset to asc for new key
    }
    setSortKey(key);
    setSortDir(dir);

    const sorted = [...filteredTokens].sort((a, b) => {
      if (key === "project") {
        return dir === "asc"
          ? a.project.localeCompare(b.project)
          : b.project.localeCompare(a.project);
      } else {
        return dir === "asc"
          ? (a.percent_change ?? 0) - (b.percent_change ?? 0)
          : (b.percent_change ?? 0) - (a.percent_change ?? 0);
      }
    });
    setFilteredTokens(sorted);
  }

  function renderPercentChange(value: number | null) {
    if (value === 0) return <span className="text-gray-400">N/A</span>;
    if (value > 0) return <span className="text-green-600 flex items-center"><ArrowUpCircle size={14} className="mr-1"/>{value.toFixed(2)}%</span>;
    return <span className="text-red-600 flex items-center"><ArrowDownCircle size={14} className="mr-1"/>{value.toFixed(2)}%</span>;
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 overflow-x-hidden relative">
        <H1>
          Tokens ({tokens.length})
        </H1>
        <input
          type="text"
          placeholder="Search by project or symbol..."
          className="border rounded-md px-2 py-1 text-md w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Logo</th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => sortBy("project")}
              >
                Project {sortKey === "project" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="px-4 py-2 text-left">Symbol</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => sortBy("percent_change")}
              >
                % Change (24h) {sortKey === "percent_change" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredTokens.map((t) => (
              <tr key={t.token_id}>
                <td className="px-4 py-2">
                  {t.logo ? (
                    <img src={t.logo} alt={t.symbol} className="h-8 w-8 rounded-full" />
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-2">{t.project}</td>
                <td className="px-4 py-2">{t.symbol}</td>
                <td className="px-4 py-2">${t.price_usd.toFixed(4)}</td>
                <td className="px-4 py-2">{renderPercentChange(t.percent_change)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
