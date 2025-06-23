"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatItem } from "@/lib/chords/utils";

interface SearchProps {
	keyNote: string;
	items: string[];
	value: string | null;
	className?: string;
  isLoading?: boolean;
}

export const SearchBox: React.FC<SearchProps> = ({ keyNote, items, value, className, isLoading }) => {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const currentSuffix = useParams<{ type: string }>().type;
	const formattedSuffix: string = formatItem(currentSuffix);
	const selectedItem = items.find((item) => item === value) || null;

	return (
		<div className={cn(className)}>
			{isDesktop ? (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" className="cursor-pointer w-full sm:w-[200px] justify-start">
							{formattedSuffix ? <>{formattedSuffix}</> : selectedItem ? <>{selectedItem}</> : <>Выберите тип</>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full sm:w-[200px] p-0" align="start">
						<ItemList keyNote={keyNote} items={items} setOpen={setOpen} />
					</PopoverContent>
				</Popover>
			) : (
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						<Button disabled={isLoading} variant="outline" className="w-full sm:w-[200px] justify-start">
							{" "}
							{/* Responsive width */}
							{selectedItem ? <>{selectedItem}</> : <>Выберите тип</>}
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className="p-4">
							<DrawerTitle>Выберите тип аккорда</DrawerTitle>
							<DrawerDescription>Выберите тип из списка ниже.</DrawerDescription>
							<div className="mt-4 border-t">
								<ItemList items={items} keyNote={keyNote} setOpen={setOpen} />
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			)}
		</div>
	);
};

interface ItemListProps {
	items: string[];
	keyNote: string;
	setOpen: (open: boolean) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, keyNote, setOpen }) => {
	return (
		<Command>
			<CommandInput placeholder="Найти тип..." className="text-base" />
			<CommandList>
				<CommandEmpty>Таких аккордов нет...</CommandEmpty>
				<CommandGroup heading="Типы">
					{items.map((item, index) => {
						const modifiedItem = item.toString().replace(/\//g, "over").replace(/#/g, "sharp");
						return (
							<Link href={`/chords/${keyNote}/${modifiedItem}`} key={index}>
								<CommandItem
									className="cursor-pointer"
									value={item}
									onSelect={() => {
										setOpen(false);
									}}
								>
									{item}
								</CommandItem>
							</Link>
						);
					})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};
