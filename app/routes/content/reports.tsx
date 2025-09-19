import React, { useEffect, useState } from "react";
import fm from "front-matter";
import Markdown from "react-markdown";
import { buildMeta } from "~/root"
import { trackEvent } from "../../hooks/tracking";
import { H1 } from "~/components/ui/h1";

const url = "https://carboncopy.news/content/reports";

export function links() {
  return [{
    rel: "canonical",
    href: url
  }];
};

export function meta() {
  return [
    buildMeta(
      "ReFi Research Reports",
      "Access our in-depth research reports on Web3 regenerative finance (ReFi) and its role in social and ecological impact.",
      url,
    )
  ];
};

const files = import.meta.glob("../../content/reports/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

type Report = {
  title: string;
  subtitle: string;
  coverImage: string;
  partner_logos: string[];
  reportLink: string;
  body: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const parsedReports: Report[] = Object.entries(files).map(([_, content]) => {
      const parsed = fm(content as string);
      const data = parsed.attributes as any;

      return {
        title: data.title || "Untitled",
        subtitle: data.subtitle || "",
        coverImage: data["cover-image"] || "",
        partner_logos: data.partner_logos || [],
        reportLink: data["report-link"] || "",
        body: parsed.body.trim(),
      };
    });

    setReports(parsedReports);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <H1 className="mb-8">Research Reports</H1>

      <div className="divide-y divide-gray-200">
        {reports.map((report, i) => (
          <div
            key={i}
            className="py-8 flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Left side: text */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{report.title}</h2>
              <h3 className="text-lg text-gray-600 mb-4">{report.subtitle}</h3>

              {/* Markdown content with GitHub-style prose */}
              <div className="prose max-w-none mb-6">
                <Markdown>{report.body}</Markdown>
              </div>

              {report.partner_logos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Produced in coordination with:
                  </p>
                  <div className="flex gap-4">
                    {report.partner_logos.map((logo, idx) => (
                      <img
                        key={idx}
                        src={logo}
                        alt="Partner logo"
                        className="h-12 object-contain"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side: cover image + button */}
            {report.coverImage && (
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <img
                  src={report.coverImage}
                  alt={report.title}
                  className="w-full h-auto object-cover rounded-lg mb-4"
                />

                {report.reportLink && (
                  <a
                    href={report.reportLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition w-full text-center"
                    onClick={() =>
                      trackEvent("download_report", {
                        category: "Reports",
                        label: report.title,
                        url: report.reportLink,
                      })
                    }
                  >
                    Download Report
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
