import { Loader2 } from "lucide-react";
import React from "react";

function ChordsLoading() {
	return (
		<div className="flex justify-center items-center py-8">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
			<span className="ml-2">Загружаем аккорды... 🎸</span>
		</div>
	);
}

export default ChordsLoading;
