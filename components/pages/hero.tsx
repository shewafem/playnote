"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "../utils/container";

const Hero = () => {
	return (
		<Container className="flex items-center justify-center">
				<motion.div
					className="max-w-full gap-8 md:gap-10 flex-col flex justify-center items-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<h1 className="mb-0 text-center text-4xl xs:text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold !leading-[1.15] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
						Освойте гитару по-новому!
					</h1>
					<p className="mb-0 text-center text-md sm:text-xl text-muted-foreground leading-relaxed sm:max-w-[65ch] max-w-[50ch]">
						Улучшайте свое мастерство на гитаре с интерактивными инструментами: онлайн-база аккордов, фретборд и практика любимых песен в реальном
						времени для игроков любого уровня!
					</p>
					<div className="flex flex-col xs:flex-row items-center gap-4">
						<Button
							size="lg"
							className="w-full cursor-pointer xs:w-auto text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
						>
							Начать играть <ArrowUpRight className="ml-2 h-5 w-5" />
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="w-full cursor-pointer xs:w-auto text-base font-semibold border-accent/50 hover:bg-accent/10 transition-all duration-300"
						>
							<CirclePlay className="mr-2 h-5 w-5" /> Смотреть демо
						</Button>
					</div>
				</motion.div>
		</Container>
	);
};

export default Hero;
