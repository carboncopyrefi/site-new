import { buildMeta } from "~/root"
import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { H1 } from "~/components/ui/h1";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface SdgMetric {
  name: string;
  value: number;
  date: string;
  unit: string | null;
  format: string;
  description: string;
  percent_change_7d: number | null;
  percent_change_28d: number | null;
}

interface SdgMetricGroupType {
  name: string;
  description: string | null;
  slug: string;
}

interface SdgMetricGroup {
  type: SdgMetricGroupType;
  metrics: SdgMetric[];
}

interface SdgData {
  name: string;
  description: string;
  slug: string;
  metric_groups: SdgMetricGroup[];
}

const url = "https://carboncopy.news/sdg";

function formatMetricValue(value: number, format: string, unit: string | null): string {
  // Parse format like "{:,.2f}" - assume it's always {:,.Xf} where X is digits
  const decimalMatch = format.match(/\.(\d+)f/);
  const decimals = decimalMatch ? parseInt(decimalMatch[1]) : 0;
  
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return unit ? `${formatted} ${unit}` : formatted;
}

export function links() {
  return [{ rel: "canonical", href: url }];
}

export function meta() {
  return buildMeta(
    "SDG Tracker",
    "A dedicated dashboard for tracking Web3's progress towards the Sustainable Development Goals (SDGs).",
    url
  );
}

export default function SDG() {
  const [sdg, setSdg] = useState<SdgData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchSdgs() {
    try {
      setLoading(true);
      setError(null);

      // 1. Try to load from cache
      const cached = localStorage.getItem("sdg_cache");
      const cachedAt = localStorage.getItem("sdg_cache_time");

      // Optional: expire after 30 minutes
      const maxAge = 10080 * 60 * 1000;

      if (cached && cachedAt && Date.now() - Number(cachedAt) < maxAge) {
        setSdg(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // 2. Fetch from API
      const res = await apiFetch("/sdg");
      setSdg(res);

      // 3. Save to cache
      localStorage.setItem("sdg_cache", JSON.stringify(res));
      localStorage.setItem("sdg_cache_time", String(Date.now()));
    } catch (err) {
      console.error("Error fetching SDGs:", err);
      setError("Failed to load SDGs.");
    } finally {
      setLoading(false);
    }
  }

  fetchSdgs();
}, []);

  if (loading) return <div className="p-4">Loading SDGs...</div>;
  if (error) return <div className="p-4">{error}</div>;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden relative">
      <H1>SDG Tracker</H1>

      {/* Grid of SDG cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {sdg.map((goal) => (
          <Card key={goal.slug} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img src={`/images/sdg/E-WEB-Goal-${goal.slug.split("-")[0].toString().padStart(2, '0')}.png`} alt={goal.name} className="w-30 h-full object-contain flex-shrink-0" />
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              {goal.metric_groups.length > 0 ? (
                <div className="space-y-4">
                  {goal.metric_groups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      {group.type.slug !== "uncategorized" && (
                      <h4 className="font-medium text-sm text-gray-700 mb-2">{group.type.name}</h4>
                      )}
                      <div className="space-y-1">
                        {group.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{metric.name}</span>
                            <span className="font-mono text-gray-900">
                              {formatMetricValue(metric.value, metric.format, metric.unit)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No metrics available</p>
              )}
            </CardContent>

            <CardFooter>
              {goal.metric_groups.length > 0 && (
                <Button asChild className="w-full py-2 bg-white hover:bg-gray-700 text-gray-800 hover:text-white font-medium rounded-lg shadow border border-gray-800 transition">
                  <Link to={`/sdg/${goal.slug}`}>Explore Data</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
