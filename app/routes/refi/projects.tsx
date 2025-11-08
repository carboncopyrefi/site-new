import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildMeta } from "~/root";
import { H1 } from "~/components/ui/h1";
import { SdgBadges } from "~/components/sdg-badges";

const url = "https://carboncopy.news/refi/projects";

export function links() {
  return [
    {
      rel: "canonical",
      href: url,
    },
  ];
}

export function meta() {
  return [
    buildMeta(
      "ReFi Landscape",
      "See an overview of projects and categories in the Web3 regenerative finance (ReFi) ecosystem.",
      url
    ),
  ];
}

// --- Types ---
interface Project {
  logo: string;
  name: string;
  slug: string;
  sdg?: string;
}

interface Category {
  category: string;
  projects: Project[];
}

interface SDGGroup {
  sdg: string;
  projects: Project[];
}

interface LandscapeResponse {
  categories: Category[];
  sdg: SDGGroup[];
}

export default function Landscape() {
  const [data, setData] = useState<LandscapeResponse>({ categories: [], sdg: [] });
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"categories" | "sdg">("categories");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.carboncopy.news/landscape");
        // const res = await fetch("http://127.0.0.1:5000/landscape");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch landscape:", err);
      }
    }
    fetchData();
  }, []);

  function slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-");
  }

  const filteredCategories = data.categories
    .map((cat) => {
      const filteredProjects = cat.projects.filter((proj) =>
        proj.name.toLowerCase().includes(search.toLowerCase())
      );
      if (
        cat.category.toLowerCase().includes(search.toLowerCase()) ||
        filteredProjects.length > 0
      ) {
        return { ...cat, projects: filteredProjects };
      }
      return null;
    })
    .filter((cat): cat is Category => cat !== null);

  const filteredSDGs = data.sdg
    .map((sdgGroup) => {
      const filteredProjects = sdgGroup.projects.filter((proj) =>
        proj.name.toLowerCase().includes(search.toLowerCase())
      );
      if (
        sdgGroup.sdg.toLowerCase().includes(search.toLowerCase()) ||
        filteredProjects.length > 0
      ) {
        return { ...sdgGroup, projects: filteredProjects };
      }
      return null;
    })
    .filter((sdg): sdg is SDGGroup => sdg !== null);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 overflow-x-hidden relative">
      <H1>Projects</H1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search projects, categories, or SDGs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-md px-2 py-1 text-md w-full md:w-1/3"
      />

      {/* Toggle View */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => setView("categories")}
          className={`px-3 py-1 rounded-md cursor-pointer ${
            view === "categories"
              ? "bg-blue-600 text-white"
              : "bg-neutral-200 text-neutral-700"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setView("sdg")}
          className={`px-3 py-1 rounded-md cursor-pointer ${
            view === "sdg"
              ? "bg-blue-600 text-white"
              : "bg-neutral-200 text-neutral-700"
          }`}
        >
          SDGs
        </button>
      </div>

      {/* Conditional Rendering */}
      {data.categories.length === 0 && data.sdg.length === 0 ? (
        <p className="text-neutral-500">Loading projects...</p>
      ) : view === "categories" ? (
        filteredCategories.length === 0 ? (
          <p className="text-neutral-500">No projects found.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {filteredCategories.map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-3 mb-4">
                <h3 className="font-semibold text-lg">
                  <Link
                    to={`../categories/${slugify(cat.category)}`}
                    className="hover:underline text-blue-600"
                  >
                    {cat.category}
                  </Link>
                </h3>
                <div className="flex flex-wrap gap-4">
                  {cat.projects.map((proj, pIdx) =>
                    proj.logo ? (
                      <Link key={pIdx} to={`../projects/${proj.slug}`}>
                        <img
                          src={proj.logo}
                          alt={proj.name}
                          title={proj.name}
                          loading="lazy"
                          className="h-16 w-16 object-contain rounded-lg shadow-sm border p-1"
                        />
                      </Link>
                    ) : null
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : filteredSDGs.length === 0 ? (
        <p className="text-neutral-500">No SDG projects found.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {filteredSDGs.map((sdgGroup, idx) => (
            <div key={idx} className="flex flex-col gap-3 mb-4">
              <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                <SdgBadges
                  sdgs={[
                    {
                      id: sdgGroup.projects[0]?.sort_id || idx, // fallback ID
                      value: sdgGroup.sdg,
                    },
                  ]}
                  layout="inline"
                />
                <h3 className="font-semibold text-lg col-span-4 md:col-span-3 lg:col-span-5 xl:col-span-7">{sdgGroup.sdg}</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {sdgGroup.projects.map((proj, pIdx) =>
                  proj.logo ? (
                    <Link key={pIdx} to={`../projects/${proj.slug}`}>
                      <img
                        src={proj.logo}
                        alt={proj.name}
                        title={proj.name}
                        loading="lazy"
                        className="h-16 w-16 object-contain rounded-lg shadow-sm border p-1"
                      />
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
