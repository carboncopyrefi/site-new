import { useEffect, useState } from "react";
import { buildMeta } from "~/root"
import { apiFetch } from "../../api/client";

interface ProjectData {
	name: string;
	metrics: string[];
	logo_url: string;
}

const url = "https://carboncopy.news/impact/projects";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "Projects Integrated",
      "See the ReFi projects that have had their data integrated to our impact dashboard.",
      url,
    )
  ];
};

export default function Projects() {
	const [projects, setProjects] = useState<ProjectData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchProjects() {
		try {
			setLoading(true);
			setError(null);

			const res = await apiFetch("/projects");

			const data = await res;
			setProjects(data); // Assuming API returns the same shape as ProjectData[]
		} catch (err) {
			console.error("Error fetching projects:", err);
			setError("Failed to load projects.");
		} finally {
			setLoading(false);
		}
		}

		fetchProjects();
	}, []);

	if (loading) return <p>Loading projects...</p>;
	if (error) return <p>{error}</p>;
	return (
	<div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden relative">
		<div>
			<h1 className="md:text-[32px] text-[17px] font-[600]">
				Projects Integrated
			</h1>
			{/* Fixed grid layout - single column on mobile, proper sizing on desktop */}
			<div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-3">
				{projects.map((item) => (
					<div
						className="rounded-xl bg-muted/50 p-4 md:p-6 min-w-0 relative flex flex-col"
						key={item.name}
					>
						{/* Project Logo */}
						{item.logo_url && (
							<img
								src={item.logo_url}
								alt={`${item.name} logo`}
								className="w-16 h-16 object-contain mb-3"
							/>
						)}

						{/* Project Title */}
						<p className="md:text-[20px] text-[16px] font-[500]">
							{item.name}
						</p>

						{/* Project Metrics */}
						<div className="mt-3 space-y-1">
							{item.metrics.map((metric) => (
								<p key={metric}>{metric}</p>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
);

}
