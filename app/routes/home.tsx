import { redirect } from "react-router";
import { buildMeta } from "~/root"

export function meta() {
	return buildMeta("ReFi Intelligence Platform","", "");
}

export function loader() {
	return redirect("/impact/overview");
}
