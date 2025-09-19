import { buildMeta } from "~/root"
import { H1 } from "~/components/ui/h1";
import {
	CartesianGrid,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	XAxis,
} from "recharts";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";

const chartData = [
	{ chain: "evm", funding: 275, fill: "rgb(52, 152, 219)" },
	{ chain: "solana", funding: 200, fill: "rgb(123, 237, 159)" },
	{ chain: "polkadot", funding: 187, fill: "rgb(231, 76, 60)" },
	{ chain: "near", funding: 173, fill: "rgb(155, 89, 182)" },
	{ chain: "other", funding: 90, fill: "rgb(241, 196, 15)" },
];

const chartConfig = {
	funding: {
		label: "Funding",
	},
	evm: {
		label: "EVM",
		color: "var(--chart-1)",
	},
	solana: {
		label: "Solana",
		color: "var(--chart-2)",
	},
	polkadot: {
		label: "Polkadot",
		color: "var(--chart-3)",
	},
	near: {
		label: "Near",
		color: "var(--chart-4)",
	},
	other: {
		label: "Other",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig;

const lineChartData = [
	{ month: "January", desktop: 186, mobile: 80 },
	{ month: "February", desktop: 305, mobile: 200 },
	{ month: "March", desktop: 237, mobile: 120 },
	{ month: "April", desktop: 73, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "June", desktop: 214, mobile: 140 },
];

const lineChartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1)",
	},
	mobile: {
		label: "Mobile",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

const url = "https://carboncopy.news/impact/chains";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "Chain Impact",
      "Get a high-level overview of chain activity across key ReFi impact metrics.",
      url,
    )
  ];
};

export default function Chains() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden relative">
			<div>
				<H1>Chains</H1>
				{/* Fixed grid layout - single column on mobile, proper sizing on desktop */}
				<div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-[1.3fr_1fr]">
					{/* Line Chart Container - Fixed width constraints */}
					<div className="h-82 rounded-xl bg-muted/50 p-2 min-w-0 overflow-hidden">
						<ChartContainer
							config={lineChartConfig}
							className="w-full h-full relative min-w-0"
						>
							<ResponsiveContainer width="100%" height="100%" minWidth={0}>
								<LineChart
									accessibilityLayer
									data={lineChartData}
									margin={{
										left: 12,
										right: 12,
										top: 8,
										bottom: 8,
									}}
								>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="month"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										tickFormatter={(value) => value.slice(0, 3)}
									/>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent />}
									/>
									<Line
										dataKey="desktop"
										type="monotone"
										stroke="var(--color-desktop)"
										strokeWidth={2}
										dot={false}
									/>
									<Line
										dataKey="mobile"
										type="monotone"
										stroke="var(--color-mobile)"
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</ChartContainer>
					</div>

					{/* Pie Chart Container - Fixed width constraints */}
					<div className="h-82 rounded-xl bg-muted/50 p-4 md:p-6 space-y-4 min-w-0 overflow-hidden">
						<ChartContainer
							config={chartConfig}
							className="mx-auto aspect-square max-h-[280px] w-full min-w-0"
						>
							<ResponsiveContainer width="100%" height="100%" minWidth={0}>
								<PieChart>
									<Pie
										data={chartData}
										dataKey="funding"
										cx="50%"
										cy="50%"
										outerRadius="80%"
									/>
									<ChartLegend
										content={<ChartLegendContent nameKey="chain" />}
										className="-translate-y-2 flex-wrap gap-2 text-xs"
									/>
								</PieChart>
							</ResponsiveContainer>
						</ChartContainer>
					</div>
				</div>
			</div>
			<div className={``}>
				<div className="grid auto-rows-min gap-4 md:grid-cols-4">
					<div className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
						<p className={`text-[30px] md:text-[40px] font-bold text-center`}>
							85%
						</p>
						<p
							className={`text-[14px] md:text-[16px] text-neutral-700 text-center`}
						>
							EVM TFI Dominance
						</p>
					</div>
					<div className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
						<p className={`text-[30px] md:text-[40px] font-bold text-center`}>
							90%
						</p>
						<p
							className={`text-[14px] md:text-[16px] text-neutral-700 text-center`}
						>
							EVM Investment Dominance
						</p>
					</div>
					<div className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
						<p className={`text-[30px] md:text-[40px] font-bold text-center`}>
							80%
						</p>
						<p
							className={`text-[14px] md:text-[16px] text-neutral-700 text-center`}
						>
							EVM Grant Dominance
						</p>
					</div>
					<div className="h-40 rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
						<p className={`text-[30px] md:text-[40px] font-bold text-center`}>
							12
						</p>
						<p
							className={`text-[14px] md:text-[16px] text-neutral-700 text-center`}
						>
							Chains Reporting
						</p>
					</div>
				</div>
			</div>
			<div className="h-fit w-full min-h-[100vh] flex flex-col flex-1 md:min-h-min space-y-2">
				<h2 className="text-[22px] font-bold">Chain Listing</h2>
				<div className="flex-1 rounded-xl bg-muted/50 p-6" />
			</div>
		</div>
	);
}
