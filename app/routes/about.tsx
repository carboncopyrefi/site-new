import { buildMeta } from "~/root"
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { H1 } from "~/components/ui/h1";

const url = "https://carboncopy.news/about";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return buildMeta(
    "About",
    "Learn more about the intelligence platform dedicated to tracking the Web3 regenerative finance (ReFi) ecosystem.",
    url
  );
};

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
        <H1>About CARBON Copy</H1>
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  );
}