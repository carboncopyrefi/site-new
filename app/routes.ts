import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("impact", "routes/impact/impact.tsx", [
		index("routes/impact/index.tsx"),
		route("overview", "routes/impact/overview.tsx"),
		route(":slug", "routes/impact/slug.tsx"),
		route("chains", "routes/impact/chains.tsx"),
		route("projects", "routes/impact/projects.tsx"),
	]),
	route("content", "routes/content/content.tsx", [
		index("routes/content/index.tsx"),
		route("resources", "routes/content/resources.tsx"),
		route("features", "routes/content/features.tsx"),
		route("learn", "routes/content/learn.tsx"),
		route("learn/:slug", "routes/content/feature-article.tsx", { id: "learn-article" }),
		route("reports", "routes/content/reports.tsx"),
		route("newsletter", "routes/content/newsletter.tsx"),
		route("authors/:slug", "routes/content/author.tsx"),
		route("features/:slug", "routes/content/feature-article.tsx"),
	]),
	route("about", "routes/about.tsx"),
	route("refi", "routes/refi/refi.tsx", [
		index("routes/refi/index.tsx"),
		route("projects", "routes/refi/projects.tsx"),
		route("projects/:slug", "routes/refi/project.tsx"),
		route("categories/:slug", "routes/refi/category.tsx"),
		route("tokens", "routes/refi/tokens.tsx"),
		route("venture-funding", "routes/refi/venture-funding.tsx"),
		route("news", "routes/refi/news.tsx"),
	]),
	// 👇 Catch-all 404 route
	route("*", "routes/errors/not-found.tsx"),
] satisfies RouteConfig;
