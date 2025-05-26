// components/interactive-fretboard/fret-numbers.tsx
import React from 'react';
import { DEFAULT_FRETS } from '@/lib/music-utils';
import { cn } from '@/lib/utils';

const FretNumbers: React.FC = () => {
  return (
    <div className="flex mb-2">
      <div className="w-10"></div>
      {[...Array(DEFAULT_FRETS)].map((_, fretIndex) => (
        <div
          key={`fret-num-${fretIndex}`}
          className={cn("w-18 text-center text-sm text-muted-foreground", ([0,, 3, 5, 7, 9, 12].includes(fretIndex+1 % 12) && fretIndex !== 0 ? "font-black text-lg" : "")) }
        >
          {fretIndex+1}
        </div>
      ))}
    </div>
  );
};

export default FretNumbers;
