import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import "./app.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import type { Route } from "./+types/root";
import { SiX, SiFarcaster, SiDiscord, SiLinkedin, SiTelegram, SiGithub } from "react-icons/si";
import { BsRssFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { usePageTracking } from "./hooks/tracking";
import ServerError from "./routes/errors/server-error";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Google Analytics (GA4) */}
        {import.meta.env.PROD && measurementId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${measurementId}', { send_page_view: false });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="dm-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {

  usePageTracking();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          {/* Left side */}
          <SidebarTrigger className="-ml-1" />

          {/* Right side: social icons */}
          <div className="flex items-center gap-4">
            <Link to="https://farcaster.xyz/carboncopy-refi" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              <SiFarcaster className="w-5 h-5" />
            </Link>
            <Link to="https://x.com/cc_refi_news" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              <SiX className="w-5 h-5" />
            </Link>
            <Link to="https://www.linkedin.com/company/carbon-copy-news/" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              <SiLinkedin className="w-5 h-5" />
            </Link>
            <Link to="https://discord.gg/53TpqNgPC5" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              <SiDiscord className="w-5 h-5" />
            </Link>
            <Link to="https://t.me/carboncopyrefi" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              <SiTelegram className="w-5 h-5" />
            </Link>
            <Link to="https://github.com/carboncopyrefi" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              <SiGithub className="w-5 h-5" />
            </Link>
            <Link to="/feed.xml" target="_blank" className="text-neutral-600 hover:text-neutral-900">
              <BsRssFill className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function buildMeta(title: string, description: string, url: string, image: string = "https://carboncopy.news/meta.jpg", type: string = "website") {
  const pageTitle = `${title} | CARBON Copy`
  return [
    { title: pageTitle },
    {description: description},
    {property: "og:title", content: pageTitle},
    {property: "og:description", content: description},
    {property: "og:image", content: image},
    {property: "og:url", content: url},
    {property: "og:type", content: type},
    {property: "og:locale", content: "en_GB"},
    {property: "twitter:title", content: pageTitle},
    {property: "twitter:description", content: description},
    {property: "twitter:image", content: image},
    {property: "twitter:site", content: "@cc_refi_news"},
    {property: "twitter:card", content: "summary_large_image"},
  ];
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <ServerError error={error} />;
}
