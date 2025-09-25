import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Info, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { buildMeta } from "~/root"
import { apiFetch } from "../../api/client";
import { H1 } from "~/components/ui/h1";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const url = "https://carboncopy.news/impact/overview";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "ReFi Intelligence Platform",
      "A data-driven tool tracking the Web3 regenerative finance (ReFi) ecosystem.",
      url,
    )
  ];
};

export default function Overview() {
  const [activity, setActivity] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    fetch("https://api.carboncopy.news/impact/feed")
      .then((res) => res.json())
      .then((data) => setActivity(data))
      .catch((err) => console.error("Error loading feed:", err));
    
    apiFetch("/overview")
    .then((res) => res)
    .then((data) => setOverview(data))
    .catch((err) => console.error("Error loading overview:", err));
  }, []);

  if (!overview) {
    return <div className="p-4">Loading...</div>;
  }

  const { investment, grants, loans, total, timeseries } = overview;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <H1>
        Impact Overview
      </H1>
      <div className="grid auto-rows-min gap-4 grid-cols-1 xl:grid-cols-[1.4fr_1fr]">
        {/* Chart */}
        <div className="h-100 rounded-xl bg-muted/50 p-2 min-w-0 overflow-hidden text-xs order-2 xl:order-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={timeseries}
              margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 7)}
              />
              <YAxis
                tickFormatter={(value) => "$" + value.toLocaleString()}
                width={"auto"}
              />
              <Tooltip formatter={(value) => "$" + value.toLocaleString() } />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="Total Funding to Impact Projects"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="xl:h-100 rounded-xl bg-muted/50 md:p-6 p-3 md:space-y-4 space-y-3 order-1 xl:order-2">
          <div className="mb-1">
            <h2 className={`md:text-[20px] text-[17px]`}>
              Total Funding to Impact Projects
            </h2>
            <p className={`md:text-[45px] text-[40px] font-bold`}>
              ${total.current.toLocaleString()}
            </p>
          </div>
          <div className={`flex w-full gap-6 mb-8`}>
            <div className="flex items-center gap-1">
              7d:{" "}
              {total.change7d < 0 ? (
                <span className="text-red-600 inline-flex items-center gap-1">
                  <ArrowDownCircle className="w-4 h-4" />
                  {total.change7d}%
                </span>
              ) : total.change7d > 0 ? (
                <span className="text-green-600 inline-flex items-center gap-1">
                  <ArrowUpCircle className="w-4 h-4" />
                  {total.change7d}%
                </span>
              ) : (
                <span className="text-yellow-600 inline-flex items-center gap-1">
                  {total.change7d}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              28d:{" "}
              {total.change28d < 0 ? (
                <span className="text-red-600 flex items-center gap-1">
                  <ArrowDownCircle className="w-4 h-4" />
                  {total.change28d}%
                </span>
              ) : total.change28d > 0 ? (
                <span className="text-green-600 inline-flex items-center gap-1">
                  <ArrowUpCircle className="w-4 h-4" />
                  {total.change28d}%
                </span>
              ) : (
                <span className="text-yellow-600 inline-flex items-center gap-1">
                  {total.change28d}%
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6 w-full">
            <div>
              <p className={`text-[18px]`}>Investments</p>
              <p className={`font-semibold text-[20px]`}>
                ${investment.current.toLocaleString()}
              </p>
              <div className={`mt-2 flex w-full gap-6`}>
                <span className="md:text-sm text-xs flex items-center gap-1">
                  7d:{" "}
                  {investment.change7d < 0 ? (
                    <span className="text-red-600 inline-flex items-center gap-1">
                      <ArrowDownCircle className="w-4 h-4" />
                      {investment.change7d}%
                    </span>
                  ) : investment.change7d > 0 ? (
                    <span className="text-green-600 inline-flex items-center gap-1">
                      <ArrowUpCircle className="w-4 h-4" />
                      {investment.change7d}%
                    </span>
                  ) : (
                    <span className="text-yellow-600 inline-flex items-center gap-1">
                      {investment.change7d}%
                    </span>
                  )}
                </span>
                <span className="md:text-sm text-xs flex items-center gap-1">
                  28d:{" "}
                  {investment.change28d < 0 ? (
                    <span className="text-red-600 inline-flex items-center gap-1">
                      <ArrowDownCircle className="w-4 h-4" />
                      {investment.change7d}%
                    </span>
                  ) : investment.change28d > 0 ? (
                    <span className="text-green-600 inline-flex items-center gap-1">
                      <ArrowUpCircle className="w-4 h-4" />
                      {investment.change28d}%
                    </span>
                  ) : (
                    <span className="text-yellow-600 inline-flex items-center gap-1">
                      {investment.change28d}%
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div>
              <p className={`text-[18px]`}>Grants</p>
              <p className={`font-semibold text-[20px]`}>
                ${grants.current.toLocaleString()}
              </p>
              <div className={`mt-2 flex w-full gap-6`}>
                <span className="md:text-sm text-xs flex items-center gap-1">
                  7d:{" "}
                  {grants.change7d < 0 ? (
                    <span className="text-red-600 inline-flex items-center gap-1">
                      <ArrowDownCircle className="w-4 h-4" />
                      {grants.change7d}%
                    </span>
                  ) : grants.change7d > 0 ? (
                    <span className="text-green-600 inline-flex items-center gap-1">
                      <ArrowUpCircle className="w-4 h-4" />
                      {grants.change7d}%
                    </span>
                  ) : (
                    <span className="text-yellow-600 inline-flex items-center gap-1">
                      {grants.change7d}%
                    </span>
                  )}
                </span>
                <span className="md:text-sm text-xs flex items-center gap-1">
                  28d:{" "}
                  {grants.change28d < 0 ? (
                    <span className="text-red-600 inline-flex items-center gap-1">
                      <ArrowDownCircle className="w-4 h-4" />
                      {grants.change7d}%
                    </span>
                  ) : grants.change28d > 0 ? (
                    <span className="text-green-600 inline-flex items-center gap-1">
                      <ArrowUpCircle className="w-4 h-4" />
                      {grants.change28d}%
                    </span>
                  ) : (
                    <span className="text-yellow-600 inline-flex items-center gap-1">
                      {grants.change28d}%
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div>
              <p className={`text-[18px]`}>Lending</p>
              <p className={`font-semibold text-[20px]`}>
                ${loans.current.toLocaleString()}
              </p>
              <div className={`mt-2 flex w-full gap-6`}>
                <span className="md:text-sm text-xs flex items-center gap-1">
                  7d:{" "}
                  {loans.change7d < 0 ? (
                    <span className="text-red-600 inline-flex items-center gap-1">
                      <ArrowDownCircle className="w-4 h-4" />
                      {loans.change7d}%
                    </span>
                  ) : loans.change7d > 0 ? (
                    <span className="text-green-600 inline-flex items-center gap-1">
                      <ArrowUpCircle className="w-4 h-4" />
                      {loans.change7d}%
                    </span>
                  ) : (
                    <span className="text-yellow-600 inline-flex items-center gap-1">
                      {loans.change7d}%
                    </span>
                  )}
                </span>
                <span className="md:text-sm text-xs flex items-center gap-1">
                  28d:{" "}
                  {loans.change28d < 0 ? (
                    <span className="text-red-600 inline-flex items-center gap-1">
                      <ArrowDownCircle className="w-4 h-4" />
                      {loans.change7d}%
                    </span>
                  ) : loans.change28d > 0 ? (
                    <span className="text-green-600 inline-flex items-center gap-1">
                      <ArrowUpCircle className="w-4 h-4" />
                      {loans.change28d}%
                    </span>
                  ) : (
                    <span className="text-yellow-600 inline-flex items-center gap-1">
                      {loans.change28d}%
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={`space-y-2`}>
        <h2 className={`text-[22px] font-bold`}>Trending</h2>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="h-40 rounded-xl bg-muted/50 p-6">
            <p className={`text-[18px]`}>Cookstove Credits</p>
            <p className={`text-[50px] font-bold`}>
              +{Number(435).toLocaleString()}
            </p>
          </div>
          <div className="h-40 rounded-xl bg-muted/50 p-6">
            <p className={`text-[18px]`}>Waste Collected</p>
            <p className={`text-[50px] font-bold`}>
              +{Number(12434).toLocaleString()}{" "}
              <span className={`font-normal text-[16px]`}>kg</span>
            </p>
          </div>
          <div className="h-40 rounded-xl bg-muted/50 p-6">
            <p className={`text-[18px]`}>Electricity Generated</p>
            <p className={`text-[50px] font-bold`}>
              +{Number(9547).toLocaleString()}{" "}
              <span className={`font-normal text-[16px]`}>MWh</span>
            </p>
          </div>
        </div>
      </div> */}
      <div className="h-fit w-full min-h-[100vh] flex flex-col flex-1 md:min-h-min space-y-2">
        <h2 className="text-[22px] font-bold">Activity</h2>

        <div className="flex-1 rounded-xl bg-muted/50 p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Title</th>
                <th className="p-2">Project</th>
                <th className="p-2">Completion Date</th>
                <th className="p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/30">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.metric}</td>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">
                    <button
                      onClick={() => setSelectedDetail(item.details)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Info className="inline w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Popup */}
        <Dialog
          open={!!selectedDetail}
          onClose={() => setSelectedDetail(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-xl overflow-y-auto max-h-[80vh]">
              <DialogTitle className="text-xl font-bold mb-4">
                Details
              </DialogTitle>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedDetail }}
              />
              <button
                className="mt-4 rounded-md bg-blue-600 text-white px-4 py-2"
                onClick={() => setSelectedDetail(null)}
              >
                Close
              </button>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
