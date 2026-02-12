import { useParams, useLocation } from "react-router-dom";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { use, useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { H1 } from "~/components/ui/h1";
import { sdgColors } from "../../utils/sdgMap";
import { buildPalette } from "../../utils/colors";
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
  const location = useLocation();

  const sdgId = Number(slug.split("-")[0]);
  const bg = sdgColors[sdgId];
  const palette = buildPalette(bg);
  
useEffect(() => {
  if (!slug) return;
  (async () => {
    setLoading(true);
    const res = await apiFetch(`/sdg/${slug}`);

    const json = await res;
    setData(json);
    setLoading(false);
  })();
}, [slug]);

  if (loading) return <div className="p-4">Loading SDG data...</div>;
  if (!data) return <div className="p-4">Not Found</div>;

  const getChangeIndicator = (value: number | null) => {
    if (value === null) return <span className="text-yellow-500">N/A</span>;

    const isPositive = value > 0;
    const isZero = value === 0;

    const color = isZero
      ? "text-yellow-600"
      : isPositive
      ? "text-green-600"
      : "text-red-600";

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
      <title>{`${data.name} | CARBON Copy`}</title>
      <meta name="description" content={data.description} />
      <meta property="og:description" content={data.description} />
      <meta property="twitter:description" content={data.description} />
      <meta property="og:title" content={`${data.name} | CARBON Copy`} />
      <meta property="twitter:title" content={`${data.name} | CARBON Copy`} />
      <meta property="og:image" content="https://carboncopy.news/meta.jpg" />
      <meta property="twitter:image" content="https://carboncopy.news/meta.jpg" />
      <meta property="og:url" content={`https://carboncopy.news${location.pathname}`} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content="@cc_refi_news" />
      <link rel="canonical" href={`https://carboncopy.news${location.pathname}`} />

      <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden relative">
        <div className="">
            <button
            onClick={() => window.history.back()}
            className="text-sm text-neutral-600 hover:text-neutral-800 cursor-pointer"
            >
            ← Back
            </button>
        </div>
        <div>
          <div className="flex items-start gap-4">
            <img src={`/images/sdg/E-WEB-Goal-${sdgId.toString().padStart(2, '0')}.png`} alt={data.name} className="w-20 h-full object-contain flex-shrink-0" />
            <div className="flex flex-col">
              <H1>
                {data.name}
              </H1>
              <p>{data.description}</p>
            </div>
          </div>
          {data.groups.map((group) => {
            const chartKeys = Object.keys(group.charts[0] || {}).filter(
              (k) => k !== "month"
            );

            // Determine how many Y axes we actually want
            const maxYAxes = 2;
            const numAxes = Math.min(chartKeys.length, maxYAxes);

            // Assign each series to either axis 0 or 1
            const axisAssignments = chartKeys.map((_, index) => {
              if (numAxes === 1) return "left";
              return index % 2 === 0 ? "left" : "right";
            });

            const lineChartConfig = chartKeys.reduce((cfg, key, index) => {
              cfg[key] = {
                label: key,
                color: `var(--color-${key})`,
                yAxisId: `y${index}`,
              };
              return cfg;
            }, {} as any);

            return (
              <div key={group.type.slug} className="mt-8">
                {group.type.slug !== "uncategorized" && (
                  <h2 className="text-[24px] font-bold mb-4">{group.type.name}</h2>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Chart */}
                  <div className="lg:col-span-2 h-100 rounded-xl p-2 min-w-0 overflow-hidden" style={{ backgroundColor: `${bg}10` }}>
                    <ChartContainer config={lineChartConfig} className="w-full h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={group.charts}
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
                          {[...Array(numAxes)].map((_, axisIndex) => (
                            <YAxis
                              key={`yaxis-${axisIndex}`}
                              yAxisId={`y${axisIndex}`}
                              orientation={axisIndex === 0 ? "left" : "right"}
                              tickFormatter={(value) => value.toLocaleString()}
                              label={{
                                value:
                                  axisIndex === 0
                                    ? chartKeys[0]?.replace(/_/g, " ")
                                    : chartKeys[1]?.replace(/_/g, " "),
                                angle: -90,
                                position: axisIndex === 0 ? "left" : "right",
                                style: { textAnchor: "middle" }
                              }}
                            />
                          ))}

                          <Tooltip formatter={(value) => value.toLocaleString()} />
                          <Legend verticalAlign="top" height={36} />

                          {chartKeys.map((key, index) => {
                            const assignedAxis =
                              numAxes === 1 ? 0 : index % 2;

                            const fallbackPalette = [
                              palette[0],
                              palette[1],
                              palette[2],
                              palette[3],
                              palette[4]
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
                                yAxisId={`y${assignedAxis}`}
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

                  {/* Metric cards */}
                  <div className="lg:col-span-1 grid auto-rows-min gap-4 grid-cols-2 lg:grid-cols-1">
                    {group.metrics.map((metric: any) => (
                      <div
                        key={metric.name}
                        className="h-40 rounded-xl p-6 flex flex-col justify-center items-center"
                        title={metric.description} // Tooltip
                        style={{ backgroundColor: `${bg}10` }}
                      >
                        <p className="text-[30px] font-bold text-center">
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
                  </div>
                </div>

                {/* Table */}
                <div className="h-fit w-full flex flex-col space-y-2 mt-4">
                  <div className="flex-1 rounded-xl p-6 overflow-auto" style={{ backgroundColor: `${bg}10` }}>
                    <div className="w-full overflow-x-auto">
                      <table className="min-w-full text-left">
                        <thead>
                          <tr>
                            {group.table.headers.map((h: string) => (
                              <th key={h} className="px-4 py-2 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {group.table.rows.map((row: any[], i: number) => (
                            <tr key={i} className="border-t" style={{ borderColor: `${bg}30` }}>
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
            );
          })}
        </div>
      </div>
    </>
  );
}
