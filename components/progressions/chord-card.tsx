// components/ui/chord-progression/chord-card.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScaleChord } from "@/lib/music-theory";
import { cn } from "@/lib/utils";

interface ChordCardProps {
  chord: ScaleChord;
  isCurrent?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ChordCard({ chord, isCurrent, className, onClick }: ChordCardProps) {
  return (
    <Card onClick={onClick} role="button" className={cn(className, `cursor-pointer py-2 gap-2 w-32 h-fit flex flex-col justify-between text-center shadow-lg transition-all duration-300 hover:shadow-xl ${isCurrent ? 'ring-2 ring-primary scale-105' : 'ring-1 ring-slate-200 dark:ring-slate-700'}`)}>
      <CardHeader className="p-0">
        <CardTitle className="p-0 text-3xl font-bold text-primary">
          {chord.numeral}
        </CardTitle>
        <CardDescription className="p-0 text-sm text-muted-foreground">
            {chord.type}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center justify-between flex-grow">
        <p className="text-2xl font-semibold">{chord.displayName}</p>
      </CardContent>
    </Card>
  );
}