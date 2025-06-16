"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

const AboutUs = () => {
	return (
		<motion.section
			className="max-w-full mt-5 gap-4 md:gap-5 flex-col flex justify-center items-center"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
		>
			<h1 className="mb-0 text-center text-4xl xs:text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.15] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
				Приложение для игры на гитаре
			</h1>
			<p className="mb-4 text-center text-sm sm:text-xl text-muted-foreground leading-relaxed sm:max-w-[65ch] max-w-[50ch]">
				Это бесплатное приложение создано с целью помощи людям, которые хотят начать играть на гитаре.
			</p>
			<motion.div 
      className="flex flex-col xs:flex-row items-center gap-4"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}>
				<Button
					size="lg"
          onClick={() => redirect("/profile/player")}
					className="w-57 p-6 cursor-pointer text-xl font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
				>
					Начать играть 🎸
				</Button>
			</motion.div>
		</motion.section>
	);
};

export default AboutUs;
