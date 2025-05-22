import LoginForm from "@/components/auth/login-form";
import Logo from "@/components/ui/logo";


export default function LoginPage() {
	return (
		<div className="bg-background flex flex-col items-center justify-center">
			<div className="flex w-full max-w-sm flex-col items-center gap-6">
				<Logo />
				<LoginForm />
			</div>
		</div>
	);
}
