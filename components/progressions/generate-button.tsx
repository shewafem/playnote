import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading?: boolean;
}

export function GenerateButton({ onGenerate, isLoading }: GenerateButtonProps) {
  return (
    <Button className="cursor-pointer w-full" onClick={onGenerate} disabled={isLoading} size="lg">
      <Wand2 className="w-5 h-5 mr-2" />
      {isLoading ? "Генерирую...🎲" : "Сгенерировать"}
    </Button>
  );
}