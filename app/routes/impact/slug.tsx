import { useParams } from "react-router-dom";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
} from "~/components/ui/chart";

export default function AggregateMetricPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  
useEffect(() => {
  if (!slug) return;
  (async () => {
    setLoading(true);
    const res = await apiFetch(`/aggregate-metric-types/${slug}`);

    const json = await res;
    setData(json);
    setLoading(false);
  })();
}, [slug]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">Not Found</div>;

  const chartKeys = Object.keys(data.charts[0] || {}).filter(
    (k) => k !== "month"
  );

  const colorMap: Record<string, string> = {
    metric1: "#0f472bff",
    metric2: "#570404ff",
    metric3: "#beab00ff",
  };

  const lineChartConfig = chartKeys.reduce((cfg, key, index) => {
    cfg[key] = {
      label: key,
      color: `var(--color-${key})`,
      yAxisId: `y${index}`,
    };
    return cfg;
  }, {} as any);

  const getChangeIndicator = (value: number | null) => {
    if (value === null) return <span className="text-yellow-500">N/A</span>;

    const isPositive = value > 0;
    const isZero = value === 0;

    const color = isZero
      ? "text-yellow-500"
      : isPositive
      ? "text-green-500"
      : "text-red-500";

    const ArrowIcon = () => {
      if (isZero) {
        return (
          ""
        );
      }
      if (isPositive) {
        return (
          <ArrowUpCircle className="w-4 h-4" />
        );
      }
      return (
        <ArrowDownCircle className="w-4 h-4" />
      );
    };

    return (
      <span className={`flex items-center gap-1 ${color}`}>
        <ArrowIcon />
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  return (
    <>
      <title>{`${data.type_name} | CARBON Copy`}</title>
      <meta name="description" content={data.description} />
      <meta property="og:description" content={data.description} />
      <meta property="twitter:description" content={data.description} />
      <meta property="og:title" content={`${data.type_name} | CARBON Copy`} />
      <meta property="twitter:title" content={`${data.type_name} | CARBON Copy`} />
      <meta property="og:image" content="https://carboncopy.news/meta.jpg" />
      <meta property="twitter:image" content="https://carboncopy.news/meta.jpg" />
      <meta property="og:url" content="https://carboncopy.news/meta.jpg" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />
      <meta property="twitter:card" content="summary_large_card" />
      <meta property="twitter:site" content="@cc_refi_news" />

      <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden relative">
        <div>
          <h1 className="md:text-[32px] text-[17px] font-[600]">
            {data.type_name}
          </h1>
          <div className="grid auto-rows-min gap-4 grid-cols-1 xl:grid-cols-[1.4fr_1fr]">
            {/* Chart */}
            <div className="h-100 rounded-xl bg-muted/50 p-2 min-w-0 overflow-hidden">
              <ChartContainer config={lineChartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.charts}
                    margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 7)}
                    />

                    {/* Dynamically create Y axes with labels */}
                    {chartKeys.map((key, index) => (
                      <YAxis
                        key={`yaxis-${key}`}
                        yAxisId={`y${index}`}
                        orientation={index % 2 === 0 ? "left" : "right"}
                        tickFormatter={(value) => value.toLocaleString()}
                        width={"auto"}
                        label={{
                          value: key.replace(/_/g, " "), // More readable
                          angle: -90,
                          position: index % 2 === 0 ? "insideLeft" : "insideRight",
                          style: { textAnchor: "middle" },
                        }}
                      />
                    ))}

                    <Tooltip formatter={(value) => value.toLocaleString() } />
                    <Legend verticalAlign="top" height={36} />

                    {chartKeys.map((key, index) => {
                      const fallbackPalette = [
                        "#570404",
                        "#beab00",
                        "#0f472b",
                      ];
                      const strokeColor =
                        getComputedStyle(document.documentElement)
                          .getPropertyValue(`--color-${key}`)
                          ?.trim() || fallbackPalette[index % fallbackPalette.length];

                      return (
                        <Line
                          key={key}
                          dataKey={key}
                          type="monotone"
                          yAxisId={`y${index}`}
                          stroke={strokeColor}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5 }}
                          name={key.replace(/_/g, " ")} // Legend label
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Placeholder right panel */}
            <div className="h-100 rounded-xl bg-muted/50 p-4 md:p-6 flex flex-col items-center justify-center">
              <p className="font-semibold mb-2 text-center">
                {data.pie_chart?.title || "Aggregate Metric"}
              </p>

              {data.pie_chart?.items && data.pie_chart.items.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.pie_chart.items}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      labelLine={false}
                      label={false}
                    >
                      {data.pie_chart.items.map((entry: any, index: number) => {
                        const fallbackPalette = [
                          "#4f46e5", // indigo
                          "#22c55e", // green
                          "#f59e0b", // amber
                          "#ef4444", // red
                          "#06b6d4", // cyan
                          "#9333ea", // purple
                        ];
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={fallbackPalette[index % fallbackPalette.length]}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip formatter={(value: number) => value.toLocaleString()} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-neutral-500 text-center">No pie chart data</p>
              )}
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {data.metrics.map((metric: any) => (
            <div
              key={metric.name}
              className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center"
              title={metric.description} // Tooltip
            >
              <p className="text-[20px] md:text-[30px] font-bold text-center">
                {Number(metric.value).toLocaleString()}{" "}
                {metric.unit && (
                  <span className="text-[10px] md:text-[15px] font-normal">
                    {metric.unit}
                  </span>
                )}
              </p>
              <p className="text-[14px] md:text-[16px] text-neutral-700 text-center">
                {metric.name}
              </p>
              {/* Percent change row */}
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  7d: {getChangeIndicator(metric.percent_change_7d)}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  28d: {getChangeIndicator(metric.percent_change_28d)}
                </span>
              </div>
            </div>
          ))}

          {/* Always include projects count */}
          <div className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
            <p className="text-[30px] md:text-[30px] font-bold text-center">
              {data.projects_count}
            </p>
            <p className="text-[14px] md:text-[16px] text-neutral-700 text-center">
              Projects Reporting
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="h-fit w-full flex flex-col space-y-2">
          <h2 className="text-[22px] font-bold">Projects</h2>
          <div className="flex-1 rounded-xl bg-muted/50 p-6 overflow-auto">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    {data.table.headers.map((h: string) => (
                      <th key={h} className="px-4 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.table.rows.map((row: any[], i: number) => (
                    <tr key={i} className="border-t">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2">
                          {typeof cell === "number"
                            ? cell.toLocaleString()
                            : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
