import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Аккорды | Playnote!",
	description: "Библиотека гитарных аккордов",
  keywords: [
    "обучение игре на гитаре", 
    "уроки игры на гитаре", 
    "аккорды гитара",
    "онлайн гитара",
    "интерактивные инструменты",
    "учить аккорды",
    "интерактивный гриф",
    "онлайн-гитара",
    "аккорды гитара",
  ],
};


export default async function Chords() {
  redirect("/chords/C");
}