import { useEffect, useState } from "react";
import { buildMeta } from "~/root"
import { apiFetch } from "../../api/client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

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
      "ReFi Venture Funding",
      "Get an overview of the current state of venture funding in the Web3 regenerative finance (ReFi) ecosystem.",
      url,
    )
  ];
};

type ApiResponse = {
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

export default function VentureFunding() {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    apiFetch("/venture-funding")
      .then((res) => res)
      .then((json) => setData(json));
  }, []);

  if (!data) {
    return <div className="p-6">Loading...</div>;
  }

  const { metrics, charts, projects, current_year_deals } = data;

  const lineChartConfig = {
    y: {
      label: "Funding",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden relative">
      <div>
        <h1 className="md:text-[32px] text-[17px] font-[600]">
          Venture Funding
        </h1>

        {/* Grid layout */}
        <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-[1.3fr_1fr]">
          {/* Line Chart */}
          <div className="h-82 rounded-xl bg-muted/50 p-2 min-w-0 overflow-hidden">
            <ChartContainer
              config={lineChartConfig}
              className="w-full h-full relative min-w-0"
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart
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
                  <Line
                    dataKey="y"
                    type="monotone"
                    stroke="var(--color-y)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Current Year Deals Table */}
          <div className="h-82 rounded-xl bg-muted/50 p-4 md:p-6 min-w-0 overflow-hidden">
            <h3 className="font-semibold mb-2 text-center">Deals This Year</h3>
            <table className="w-full text-sm">
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
      </div>

      {/* Metrics */}
      <div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
            <p className="text-[30px] md:text-[40px] font-bold text-center">
              ${metrics.total_funding.toLocaleString()}
            </p>
            <p className="text-[14px] md:text-[16px] text-neutral-700 text-center">
              Raised
            </p>
          </div>
          <div className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
            <p className="text-[30px] md:text-[40px] font-bold text-center">
              {metrics.total_deals.toLocaleString()}
            </p>
            <p className="text-[14px] md:text-[16px] text-neutral-700 text-center">
              Deals
            </p>
          </div>
          <div className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
            <p className="text-[30px] md:text-[40px] font-bold text-center">
              {projects.length}
            </p>
            <p className="text-[14px] md:text-[16px] text-neutral-700 text-center">
              Projects Reporting
            </p>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="h-fit w-full min-h-[100vh] flex flex-col flex-1 md:min-h-min space-y-2">
        <h2 className="text-[22px] font-bold">Projects</h2>
        <div className="flex-1 rounded-xl bg-muted/50 p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-1">Project</th>
                <th className="py-1 text-right">Funding</th>
                <th className="py-1 text-right">Deals</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, idx) => (
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
        </div>
      </div>
    </div>
  );
}
