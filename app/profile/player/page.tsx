import { auth } from "@/auth";
import AlphaTabPlayer from "@/components/player/alpha-tab-player";
import { redirect } from "next/navigation";

export default async function Home() {
	const session = await auth();
	if (!session?.user?.id) {
		redirect("/sign-in");
	}
	return <AlphaTabPlayer />;
}
