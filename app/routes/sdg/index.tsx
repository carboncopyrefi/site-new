import { buildMeta } from "~/root"
import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import { H1 } from "~/components/ui/h1";
import { SdgBadges } from "~/components/sdg-badges";
import { Link } from "react-router-dom";

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

interface SdgData {
  name: string;
  description: string;
  slug: string;
  metrics: SdgMetric[];
}

const url = "https://carboncopy.news/sdg";

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

      {/* 2 items per row grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {sdg.map((goal) => (
          <div
            key={goal.slug}
            className="relative overflow-hidden group"
          >
            {/* SDG badge */}
            <SdgBadges
              sdgs={[
                {
                  id: Number(goal.slug.split("-")[0]),
                  value: goal.name,
                },
              ]}
              layout="inline"
              gap={2}
            />

            {/* Slide-in overlay */}
            <div
              className="
                absolute inset-0 
                bg-white/90 backdrop-blur-sm
                translate-x-[-100%]
                group-hover:translate-x-0
                transition-transform duration-400 ease-in-out
                flex flex-col p-4
              "
            >
              <p className="text-md text-gray-800">{goal.description}</p>

              <Link
                to={`/sdg/${goal.slug}`}
                className="inline-block border-2 border-gray-800 text-gray-800 text-md px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition mt-auto"
              >
                Explore data →
              </Link>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
}
