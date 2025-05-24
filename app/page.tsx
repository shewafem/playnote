import { auth } from "@/auth";
import Hero from "@/components/pages/hero";

export default async function Home() {
  const session = await auth();
  console.log(session)
	return (
		<>
			<Hero/>
		</>
	);
}
