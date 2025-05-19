// components/interactive-fretboard/fret-numbers.tsx
import React from 'react';
import { DEFAULT_FRETS } from '@/lib/music-utils';

const FretNumbers: React.FC = () => {
  return (
    <div className="flex mb-2">
      <div className="w-10"></div>
      {[...Array(DEFAULT_FRETS)].map((_, fretIndex) => (
        <div
          key={`fret-num-${fretIndex}`}
          className="w-14 text-center text-sm text-muted-foreground"
        >
          {fretIndex + 1}
        </div>
      ))}
    </div>
  );
};

export default FretNumbers;