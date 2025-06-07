import { auth } from "@/auth";
import { Feature } from "@/components/pages/feature";
import Hero from "@/components/pages/hero";
export default async function Home() {
	const session = await auth();
	console.log(session?.user);
	return (
		<>
			<Hero />
			<Feature />
		</>
	);
}
