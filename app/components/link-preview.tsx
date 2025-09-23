import React, { useEffect, useState } from "react";
import { apiFetch } from "~/api/client";

interface LinkPreviewProps {
  url: string;
}

interface Metadata {
  title: string;
  description: string;
  image: string;
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeta() {
      try {
        const data = await apiFetch(`/link-preview?url=${encodeURIComponent(url)}`);
        setMeta(data);
      } catch (err) {
        console.error("Failed to fetch metadata:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeta();
  }, [url]);

  if (loading) return (
    <div className="flex justify-center my-5">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
        <span className="sr-only">Loading link preview...</span>
    </div>
  );
  if (!meta) return <a href={url}>{url}</a>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-xl rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden no-underline mb-4"
    >
      {!imgError && meta.image && (
        <img
          src={meta.image}
          alt={meta.title}
          className="w-full h-48 object-cover my-0"
          onError={() => setImgError(true)} // hide if broken
        />
      )}
      <div className="pt-0 pb-3 px-4">
        <h4 className="font-semibold text-gray-800">{meta.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{meta.description}</p>
        <span className="text-xs text-blue-600">{url}</span>
      </div>
    </a>
  );
}
