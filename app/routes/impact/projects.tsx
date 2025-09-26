import { useEffect, useState } from "react";
import { buildMeta } from "~/root"
import { apiFetch } from "../../api/client";
import { Link } from "react-router-dom";
import { H1 } from "~/components/ui/h1";

interface ProjectData {
	name: string;
	metrics: string[];
	logo_url: string;
	slug: string;
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
			<H1>
				Projects Integrated
			</H1>
			{/* Fixed grid layout - single column on mobile, proper sizing on desktop */}
			<div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
				{projects.map((item) => (
					<div
					key={item.name}
					className="rounded-xl bg-muted/50 p-4 md:p-6 min-w-0 relative flex flex-col"
					>
					<div className="mb-5">
						{/* Project Logo */}
						{item.logo_url && (
						<img
							src={item.logo_url}
							alt={`${item.name} logo`}
							className="w-16 h-16 object-contain mb-3"
						/>
						)}

						{/* Project Title */}
						<p className="md:text-[20px] text-[18px] font-[600]">
						{item.name}
						</p>

						{/* Project Metrics */}
						<div className="mt-3 space-y-1">
						{item.metrics.map((metric) => (
							<p key={metric}>{metric}</p>
						))}
						</div>
					</div>

					{/* Full-width button link */}
					<Link
						to={`/refi/projects/${item.slug}`}
						className="mt-auto block w-full text-center rounded-lg bg-blue-600 text-white font-medium py-2 px-4 hover:bg-blue-700 transition"
					>
						View Project
					</Link>
					</div>
				))}
				</div>
		</div>
	</div>
);

}
