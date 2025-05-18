import { Button } from "@/components/ui/button";
import { Trash2, Undo2 } from "lucide-react";

interface CustomProgressionToolbarProps {
  onClearProgression: () => void;
  onRemoveLastChord: () => void;
  hasCustomChords: boolean;
}

export function CustomProgressionToolbar({
  onClearProgression,
  onRemoveLastChord,
  hasCustomChords,
}: CustomProgressionToolbarProps) {
  if (!hasCustomChords) return null;

  return (
    <div className="flex gap-3 items-center">
      <Button className="cursor-pointer" variant="outline" onClick={onRemoveLastChord} size="sm">
        <Undo2 className="w-4 h-4 mr-2" />
        Убрать
      </Button>
      <Button className="cursor-pointer" variant="destructive" onClick={onClearProgression} size="sm">
        <Trash2 className="w-4 h-4 mr-2" />
        Очистить
      </Button>
      <span className="text-sm text-muted-foreground ml-2">Изменение прогрессии</span>
    </div>
  );
}