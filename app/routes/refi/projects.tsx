import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildMeta } from "~/root";
import { H1 } from "~/components/ui/h1";

const url = "https://carboncopy.news/refi/landscape";

export function links() {
  return [{
    rel: "canonical",
    href: url,
  }];
}

export function meta() {
  return [
    buildMeta(
      "ReFi Landscape",
      "See an overview of projects and categories in the Web3 regenerative finance (ReFi) ecosystem.",
      url,
    ),
  ];
}

interface Project {
  logo: string;
  name: string;
  slug: string;
}

interface Category {
  category: string;
  projects: Project[];
}

export default function Landscape() {
  const [data, setData] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://api.carboncopy.news/landscape");
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

  // filter categories + projects based on search
  const filteredData = data
    .map((cat) => {
      const filteredProjects = cat.projects.filter((proj) =>
        proj.name.toLowerCase().includes(search.toLowerCase())
      );
      // show category if search matches category OR any project
      if (
        cat.category.toLowerCase().includes(search.toLowerCase()) ||
        filteredProjects.length > 0
      ) {
        return { ...cat, projects: filteredProjects };
      }
      return null;
    })
    .filter((cat): cat is Category => cat !== null);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 overflow-x-hidden relative">
      <H1>Landscape</H1>
      <input
        type="text"
        placeholder="Search projects or categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-md px-2 py-1 text-md w-full md:w-1/3"
      />


      {data.length === 0 ? (
        <p className="text-neutral-500">Loading landscape...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-neutral-500">No results found.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {filteredData.map((cat, idx) => (
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
      )}
    </div>
  );
}