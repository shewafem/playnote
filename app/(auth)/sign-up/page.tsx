import { auth } from "@/auth";
import RegistrationForm from "@/components/auth/registration-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	const session = await auth();
	if (session) {
		redirect("/profile");
	}
	return <RegistrationForm className="mt-5 sm:mt-10 mx-auto" />;
}
