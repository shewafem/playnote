import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Container } from "../utils/container";
import Link from "next/link";
import Logo from "../ui/logo";

const sections = [
	{
		title: "Теория",
		links: [
			{ name: "Аккорды", href: "/chords" },
			{ name: "Блог", href: "/blog" },
			{ name: "Курсы", href: "/courses" },
		],
	},
	{
		title: "Практика",
		links: [
			{ name: "Гриф", href: "/fretboard" },
			{ name: "Плеер", href: "/player" },
		],
	},
	{
		title: "Контакты",
		links: [{ name: "О нас", href: "/about" }],
	},
];

const Footer = () => {
	return (
		<footer className="mt-auto">
			<Container className="flex items-center flex-col border-t bg-card/95 pt-8">
				<div className="flex flex-col items-center justify-between gap-10 lg:gap-20 text-center xs:flex-row sm:items-start sm:text-left">
					<div className="flex w-full flex-col items-center justify-between gap-6 lg:items-start">
						{/* Logo */}
						<div className="flex items-center lg:justify-start">
							<Logo size={28}></Logo>
						</div>
						<ul className="flex items-center space-x-6 text-muted-foreground">
							<li className="font-medium hover:text-primary">
								<Link href="#">
									<FaInstagram className="size-6" />
								</Link>
							</li>
							<li className="font-medium hover:text-primary">
								<Link href="#">
									<FaFacebook className="size-6" />
								</Link>
							</li>
							<li className="font-medium hover:text-primary">
								<Link href="#">
									<FaTwitter className="size-6" />
								</Link>
							</li>
							<li className="font-medium hover:text-primary">
								<Link href="#">
									<FaLinkedin className="size-6" />
								</Link>
							</li>
						</ul>
					</div>
					<div className="flex justify-center gap-10 lg:gap-20">
						{sections.map((section, sectionIdx) => (
							<div className="flex flex-col items-center" key={sectionIdx}>
								<h3 className="mb-6 font-bold">{section.title}</h3>
								<ul className="space-y-4 text-sm text-muted-foreground">
									{section.links.map((link, linkIdx) => (
										<li key={linkIdx} className="font-medium hover:text-primary">
											<Link href={link.href}>{link.name}</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="mt-6 flex flex-col justify-between gap-4 pt-2 text-center text-sm font-medium text-muted-foreground lg:flex-row lg:items-center lg:text-left">
					<p>© 2025 Playnote</p>
				</div>
			</Container>
		</footer>
	);
};

export { Footer };
