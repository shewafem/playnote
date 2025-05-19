import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import Logo from "../ui/logo";

const socials = [
	{ icon: <FaInstagram className="size-6" />, link: "#" },
	{ icon: <FaFacebook className="size-6" />, link: "#" },
	{ icon: <FaTwitter className="size-6" />, link: "#" },
	{ icon: <FaLinkedin className="size-6" />, link: "#" },
];

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
		<footer className="mt-12 border-t">
			<Container className="flex items-center flex-col sm:flex-row gap-4 pt-6 justify-between">
				<div className="flex h-25 flex-col items-center gap-5 lg:items-start">
					{/* Logo */}
						<Logo></Logo>
					<ul className="flex items-center gap-6 text-muted-foreground">
						{socials.map((social, index) => (
							<li key={index} className="font-medium hover:text-primary">
								<Link href={social.link}>{social.icon}</Link>
							</li>
						))}
					</ul>
				</div>
				<div className="flex justify-center gap-10 flex-wrap lg:gap-20">
					{sections.map((section, sectionIdx) => (
						<div className="flex flex-col items-center" key={sectionIdx}>
							<h3 className="mb-6 font-bold">{section.title}</h3>
							<ul className="space-y-4 text-sm text-muted-foreground">
								{section.links.map((link, linkIdx) => (
									<li key={linkIdx} className="font-medium text-center hover:text-primary">
										<Link href={link.href}>{link.name}</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</Container>
		</footer>
	);
};

export { Footer };
