import { useEffect, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronRight, Loader } from "lucide-react";
import { NavLink } from "react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "~/components/ui/sidebar";
import { getSidebarData } from "./sidebar";

// Sidebar data is bundled at build time
const sidebarDataPromise = getSidebarData();

export function AppSidebar() {
	const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const { isMobile, setOpenMobile } = useSidebar();

	useEffect(() => {
		sidebarDataPromise
			.then((data) => {
				setSidebarData(data);
				setError(false);
			})
			.catch(() => {
				setError(true);
				setSidebarData(null);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<Sidebar variant="inset">
				<SidebarContent className="bg-white p-4 gap-2">
					<span>Loading menu...</span>
				</SidebarContent>
			</Sidebar>
		);
	}

	if (error || !sidebarData) {
		return (
			<Sidebar variant="inset">
				<SidebarContent className="bg-white p-4">
					Failed to load menu.
				</SidebarContent>
			</Sidebar>
		);
	}

	return (
		<Sidebar variant="inset">
			<SidebarContent className="bg-white flex flex-col min-h-full">
				<SidebarGroup>
					<SidebarGroupLabel className="mb-5">
						<div className="flex items-center gap-2">
							<img
								src="/images/logo.png" // replace with your logo path
								alt="CARBON Copy Logo"
								className="h-10 w-10" // adjust sizing
							/>
							<span>CARBON Copy</span>
						</div>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						{sidebarData.navMain.map((item) => {
							if (item.isCollapsible && item.items) {
								return (
									<Collapsible key={item.title} defaultOpen className="group/collapsible">
										<SidebarGroup>
											<SidebarGroupLabel
												asChild
												className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
											>
												<CollapsibleTrigger>
													<span className={`text-[20px] font-[500]`}>
														{item.title}{" "}
													</span>
													<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
												</CollapsibleTrigger>
											</SidebarGroupLabel>
											<CollapsibleContent>
												<SidebarGroupContent>
													<SidebarMenu>
														{item.items.map((subItem) => (
															<SidebarMenuItem key={subItem.title}>
																<SidebarMenuButton
																	asChild
																	isActive={subItem.isActive}
																	className={`text-[15px]`}
																>
																	<NavLink
																		to={item.url + subItem.url}
																		className="flex justify-between items-center"
																		onClick={() => {
																			if (isMobile) setOpenMobile(false);
																		}}
																	>
																		{({ isPending, isActive }) => (
																			<>
																				<span
																					className={`${
																						isActive &&
																						"text-yellow-500 font-semibold"
																					}`}
																				>
																					{subItem.title}
																				</span>
																				{isPending && (
																					<Loader
																						className="animate-spin"
																						size={10}
																					/>
																				)}
																			</>
																		)}
																	</NavLink>
																</SidebarMenuButton>
															</SidebarMenuItem>
														))}
													</SidebarMenu>
												</SidebarGroupContent>
											</CollapsibleContent>
										</SidebarGroup>
									</Collapsible>
								);
							}

							return (
								<SidebarGroup key={item.title} className={`list-none`}>
									<SidebarMenu>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<NavLink
													to={item.url}
													className="text-[20px] font-[500] flex justify-between items-center"
												>
													{({ isActive, isPending }) => (
														<>
															<span
																className={`${
																	isActive && "text-yellow-500 font-semibold"
																}`}
															>
																{item.title}
															</span>
															{isPending && (
																<Loader className="animate-spin" size={10} />
															)}
														</>
													)}
												</NavLink>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroup>
							);
						})}
					</SidebarGroupContent>
				</SidebarGroup>
				<div className="mt-auto p-4 text-xs text-gray-500">
					Copyright © 2025<br />CARBON Copy
				</div>
			</SidebarContent>
		</Sidebar>
	);
}
