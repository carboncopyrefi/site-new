import { buildMeta } from "~/root"
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export function meta() {
  return buildMeta("About");
}

export default function About() {

  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch("/pages/about.md")
      .then((res) => res.text())
      .then(setMarkdown)
      .catch((err) => console.error("Error loading about.md:", err));
  }, []);

  return (
    <div className="prose max-w-none p-6 bg-white rounded-lg shadow">
      <div className="w-full md:max-w-3xl lg:max-w-3xl">
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  );
}