// app/sidebar-data.ts
import { apiFetch } from "../api/client";

export type SidebarData = {
  navMain: {
    title: string;
    url: string;
    isCollapsible?: boolean;
    items?: { title: string; url: string }[];
  }[];
};

export async function getSidebarData(): Promise<SidebarData> {
  const types = await apiFetch("/aggregate-metric-types");

  const dynamicItems = types.map((type: { name: string; slug: string }) => ({
    title: type.name,
    url: `/${type.slug}`,
  }));

  return {
    navMain: [
      { title: "Home", url: "/", isCollapsible: false },
      {
        title: "Impact",
        url: "/impact",
        isCollapsible: true,
        items: [...dynamicItems, { title: "Projects", url: "/projects" }],
      },
      {
        title: "ReFi",
        url: "/refi",
        isCollapsible: true,
        items: [
          { title: "Projects", url: "/projects" },
          { title: "Tokens", url: "/tokens" },
          { title: "News", url: "/news" },
          { title: "Venture Funding", url: "/venture-funding" },
        ],
      },
      {
        title: "Content",
        url: "/content",
        isCollapsible: true,
        items: [
          { title: "Features", url: "/features" },
          { title: "Learn", url: "/learn" },
          { title: "Reports", url: "/reports" },
          { title: "Resources", url: "/resources" },
          { title: "Newsletter", url: "/newsletter" },
        ],
      },
      { title: "About", url: "/about", isCollapsible: false },
    ],
  };
}
