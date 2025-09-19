import React, { useEffect, useState } from "react";
import { buildMeta } from "~/root"
import { iconMap } from "~/components/icons"
import { H1 } from "~/components/ui/h1";

// Type for the API response
interface Resource {
  company: { name: string; slug: string };
  date: string;
  link: string;
  medium: { icon: string; medium: string }[];
  title: string;
  topic: string;
}

const url = "https://carboncopy.news/content/resources";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "ReFi Resources",
      "A curated compilation of key resources for the Web3 regenerative finance (ReFi) ecosystem.",
      url,
    )
  ];
};

const PAGE_SIZE = 20;

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedMedium, setSelectedMedium] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<"title" | "source" | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetch("https://api.carboncopy.news/knowledge")
      .then((res) => res.json())
      .then((data) => {
        setResources(data);
        setFilteredResources(data);
      });
  }, []);

  // Unique filters
  const topics = Array.from(new Set(resources.map((r) => r.topic))).sort();
  const mediums = Array.from(new Set(resources.flatMap((r) => r.medium.map((m) => m.medium)))).sort();

  // Filtering + sorting
  useEffect(() => {
    let filtered = resources;

    if (search) {
      filtered = filtered.filter((r) =>
        (r.title + r.topic + r.company.name).toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedTopic) {
      filtered = filtered.filter((r) => r.topic === selectedTopic);
    }

    if (selectedMedium) {
      filtered = filtered.filter((r) => r.medium.some((m) => m.medium === selectedMedium));
    }

    // Sorting
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = sortKey === "title" ? a.title : a.company?.name || "";
        let bVal = sortKey === "title" ? b.title : b.company?.name || "";

        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    setFilteredResources(filtered);
    setCurrentPage(1);
  }, [search, selectedTopic, selectedMedium, sortKey, sortOrder, resources]);

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / PAGE_SIZE);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Handle sort toggle
  const handleSort = (key: "title" | "source") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Helper for showing arrow on active column
  const renderSortArrow = (key: "title" | "source") => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <H1>
          Resources ({filteredResources.length})
        </H1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="border rounded-md px-3 py-1 text-md"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="">All Topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        <select
          className="border rounded-md px-3 py-1 text-md"
          value={selectedMedium}
          onChange={(e) => setSelectedMedium(e.target.value)}
        >
          <option value="">All Mediums</option>
          {mediums.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button
          className="px-4 py-1 border rounded-md text-md bg-gray-50 hover:bg-gray-100"
          onClick={() => {
            setSearch("");
            setSelectedTopic("");
            setSelectedMedium("");
            setSortKey("");
          }}
        >
          Reset
        </button>
        <input
          type="text"
          placeholder="Search by title, topic, or source..."
          className="border rounded-md px-3 py-1 text-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left"></th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => sortBy("title")}
              >
                Title{" "}
                {sortKey === "title" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="px-4 py-2 text-left">Topic</th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => sortBy("source")}
              >
                Source{" "}
                {sortKey === "source" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedResources.map((r, idx) => (
              <tr key={idx}>
                <td className="justify-center flex items-center px-4 py-2">
                  {iconMap[r.medium[0].icon.toLowerCase()] ?? r.medium[0].icon}
                </td> 
                <td className="pe-4 py-2">
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {r.title}
                  </a>
                </td>
                <td className="px-4 py-2">{r.topic}</td>
                <td className="px-4 py-2">{r.company?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-2">
        <button
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
