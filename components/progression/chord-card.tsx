// components/ui/chord-progression/chord-card.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScaleChord } from "@/lib/music-theory";

interface ChordCardProps {
  chord: ScaleChord;
  isCurrent?: boolean; // Optional: for highlighting current chord in playback (future feature)
}

export function ChordCard({ chord, isCurrent }: ChordCardProps) {
  return (
    <Card className={`p-2 gap-2 w-32 h-38 flex flex-col justify-between text-center shadow-lg transition-all duration-300 hover:shadow-xl ${isCurrent ? 'ring-2 ring-primary scale-105' : 'ring-1 ring-slate-200 dark:ring-slate-700'}`}>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">
          {chord.numeral}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
            {chord.type}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center justify-between flex-grow">
        <p className="text-2xl font-semibold">{chord.rootNote}</p>
        <p className="text-xs text-muted-foreground">{`(${chord.displayName})`}</p>
      </CardContent>
    </Card>
  );
}