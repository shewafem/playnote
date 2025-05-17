// components/ui/chord-progression/progression-display.tsx
import { ScaleChord } from "@/lib/music-theory";
import { ChordCard } from "./chord-card";

interface ProgressionDisplayProps {
  progressionChords: (ScaleChord | undefined)[]; // Can have undefined if numeral not found
}

export function ProgressionDisplay({ progressionChords }: ProgressionDisplayProps) {
  if (!progressionChords || progressionChords.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg bg-muted/50">
        <p className="text-muted-foreground">Выберите или сгенерируйте прогрессию</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 py-6 justify-center md:justify-start">
      {progressionChords.map((chord, index) =>
        chord ? (
          <ChordCard key={`${chord.numeral}-${chord.rootNote}-${index}`} chord={chord} />
        ) : (
          <div key={`undefined-${index}`} className="w-32 h-40 flex items-center justify-center border border-dashed rounded-md bg-muted/30">
            <p className="text-sm text-destructive">?</p>
          </div>
        )
      )}
    </div>
  );
}