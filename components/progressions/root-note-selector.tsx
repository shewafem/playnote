import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NOTES } from "@/lib/music-theory";

interface RootNoteSelectorProps {
  currentRootNote: string;
  onRootNoteChange: (newRoot: string) => void;
}

export function RootNoteSelector({ currentRootNote, onRootNoteChange }: RootNoteSelectorProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor="root-note" className="text-sm font-medium">Тоника</Label>
      <Select value={currentRootNote} onValueChange={onRootNoteChange}>
        <SelectTrigger id="root-note" className="w-auto">
          <SelectValue placeholder="Select Root Note" />
        </SelectTrigger>
        <SelectContent>
          {NOTES.map(note => (
            <SelectItem key={note} value={note}>
              {note}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}