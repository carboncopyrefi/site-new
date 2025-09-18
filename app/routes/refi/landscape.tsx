import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildMeta } from "~/root"

const url = "https://carboncopy.news/refi/landscape";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "ReFi Landscape",
      "See an overview of projects and categories in the Web3 regenerative finance (ReFi) ecosystem.",
      url,
    )
  ];
};

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

  // helper to slugify category name
  function slugify(name: string) {
    return name.toLowerCase().replace(/\s+/g, "-");
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 overflow-x-hidden relative">
      <h1 className="md:text-[32px] text-[17px] font-[600]">Landscape</h1>

      {data.length === 0 ? (
        <p className="text-neutral-500">Loading...</p>
      ) : (
        <div className="flex flex-col gap-8">
          {data.map((cat, idx) => (
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
                    <Link
                      to={`../projects/${proj.slug}`}
                    >
                      <img
                        key={pIdx}
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
