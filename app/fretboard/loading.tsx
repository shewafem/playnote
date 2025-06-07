import { Loader2 } from "lucide-react";
import React from "react";

function FretboardLoading() {
  return (
    <div className="flex h-full w-full justify-center items-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Загружаем гриф... 🎸</span>
    </div>
  );
}

export default FretboardLoading;
