import { useEffect, useState } from "react";
import { buildMeta } from "~/root"
import { apiFetch } from "../../api/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { H1 } from "~/components/ui/h1";
import Modal from "~/components/modal";
import { FundingDataset } from "~/components/funding-dataset";
import { Info } from "lucide-react";

const url = "https://carboncopy.news/refi/funding";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "ReFi Funding",
      "Get an overview of the current state of venture and public goods funding in the Web3 regenerative finance (ReFi) ecosystem.",
      url,
    )
  ];
};

type FundingData = {
  metrics: {
    total_funding: number;
    total_deals: number;
  };
  charts: {
    funding_by_year: { x: string; y: number }[];
    deals_by_year: { x: string; y: number }[];
  };
  projects: {
    name: string;
    total_funding: number;
    deal_count: number;
  }[];
  current_year_deals: {
    project: string;
    amount: number;
  }[];
};

type ApiResponse = {
  pgf_funding: FundingData;
  venture_funding: FundingData;
};

export default function Funding() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [pgfSearch, setPgfSearch] = useState("");
  const [pgfPage, setPgfPage] = useState(1);
  const [ventureSearch, setVentureSearch] = useState("");
  const [venturePage, setVenturePage] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    apiFetch("/funding")
      .then((res) => res)
      .then((json) => setData(json));
  }, []);

  if (!data) {
    return <div className="p-6">Loading...</div>;
  }

  const renderFundingSection = (
    title: string,
    fundingData: FundingData,
    searchQuery: string,
    setSearchQuery: (query: string) => void,
    currentPage: number,
    setCurrentPage: (page: number) => void
  ) => {
    const { metrics, charts, projects, current_year_deals } = fundingData;
    const pageSize = 10;

    const filteredProjects = projects.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProjects.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProjects = filteredProjects.slice(startIndex, startIndex + pageSize);

    const lineChartConfig = {
      y: {
        label: "Funding",
        color: "var(--chart-3)",
      },
    };

    return (
      <>
        <div className="space-y-4">
          {/* Grid layout with Chart and Deals Table */}
          <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-[1.3fr_1fr]">
            {/* Bar Chart */}
            <div className="rounded-xl bg-muted/50 p-2 min-w-0 overflow-hidden">
              <ChartContainer
                config={lineChartConfig}
                className="w-full h-full relative min-w-0"
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={charts.funding_by_year}
                    margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="x"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <YAxis
                      tickFormatter={(value) => "$" + value.toLocaleString()}
                      width={"auto"}
                    />
                    <Bar
                      dataKey="y"
                      fill="var(--color-y)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Current Year Deals Table */}
            <div className="rounded-xl bg-muted/50 p-4 md:p-6 min-w-0 o`verflow-hidden">
              <h3 className="font-semibold mb-2 text-center">{title === "PGF" ? "Raised Last Year" : "Deals This Year"}</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="py-1">Project</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {current_year_deals.map((deal, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-3">{deal.project}</td>
                      <td className="py-3 text-right">
                        {deal.amount > 0
                          ? `$${deal.amount.toLocaleString()}`
                          : "Undisclosed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
              <p className="text-[30px] md:text-[40px] font-bold text-center">
                ${metrics.total_funding.toLocaleString()}
              </p>
              <p className="text-[14px] md:text-[16px] text-neutral-700 text-center">
                Raised
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
              <p className="text-[30px] md:text-[40px] font-bold text-center">
                {metrics.total_deals.toLocaleString()}
              </p>
              <p className="text-[14px] md:text-[16px] text-neutral-700 text-center">
                {title === "PGF" ? "Funding Events" : "Deals"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
              <p className="text-[30px] md:text-[40px] font-bold text-center">
                {projects.length}
              </p>
              <p className="text-[14px] md:text-[16px] text-neutral-700 text-center">
                Projects
              </p>
            </div>
          </div>

          {/* Projects Table */}
          <div className="h-fit w-full min-h-[100vh] flex flex-col flex-1 md:min-h-min space-y-2">
            <div className="flex-1 rounded-xl bg-muted/50 p-6 overflow-x-auto">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="py-1">Project</th>
                    <th className="py-1 text-right">Total {title}</th>
                    <th className="py-1 text-right">{title === "PGF" ? "Funding Events" : "Deals"}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-3">{p.name}</td>
                      <td className="py-3 text-right">
                        {p.total_funding > 0
                          ? `$${p.total_funding.toLocaleString()}`
                          : "Undisclosed"}
                      </td>
                      <td className="py-1 text-right">{p.deal_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No projects found matching your search.
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden relative">
      <H1>
        Funding
      </H1>
      
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[22px] font-bold">Public Goods Funding</h2>
            <>
                <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center justify-center rounded-full p-1 cursor-pointer"
                    aria-label="View public goods funding data"
                >
                    <Info className="w-6 h-6" />
                </button>

                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    title="Public Goods Funding Data"
                    body={FundingDataset}
                />
            </>
          </div>
          {renderFundingSection("PGF", data.pgf_funding, pgfSearch, setPgfSearch, pgfPage, setPgfPage)}
        </div>
        <div>
          <h2 className="text-[22px] font-bold mb-4">Venture Funding</h2>
          {renderFundingSection("Venture Funding", data.venture_funding, ventureSearch, setVentureSearch, venturePage, setVenturePage)}
        </div>
      </div>
    </div>
  );
}
