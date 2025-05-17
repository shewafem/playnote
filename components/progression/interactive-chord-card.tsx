// components/ui/chord-progression/interactive-chord-card.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScaleChord } from "@/lib/music-theory";
//import { PlusCircle } from "lucide-react";

interface InteractiveChordCardProps {
  chord: ScaleChord;
  onClick: (chord: ScaleChord) => void;
  disabled?: boolean;
}

export function InteractiveChordCard({ chord, onClick, disabled }: InteractiveChordCardProps) {
  return (
    <Card
      className={`gap-2 p-2 w-32 h-36 flex flex-col text-center shadow-md transition-all duration-200 ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-muted/50'
          : 'hover:shadow-xl hover:ring-2 hover:ring-primary hover:scale-105 cursor-pointer'
      } ring-1 ring-slate-200 dark:ring-slate-700 group`}
      onClick={() => !disabled && onClick(chord)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Add ${chord.displayName} to progression`}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-3xl font-bold text-primary group-hover:text-primary-focus">
          {chord.numeral}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {chord.type}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center justify-between flex-grow">
        <p className="text-2xl font-semibold">{chord.rootNote}</p>
        <p className="text-xs text-muted-foreground mt-1">{`(${chord.displayName})`}</p>
        {/*{!disabled && (
          <PlusCircle className="absolute w-6 h-6 bottom-[-1rem] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}*/}
      </CardContent>
    </Card>
  );
}