// components/interactive-fretboard/fret-wire.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface FretWireProps {
  isNut?: boolean;
}

const FretWire: React.FC<FretWireProps> = ({ isNut = false }) => {
  const className = cn(
    "absolute top-0 bottom-0 z-10",
    isNut ? "w-1.5 right-[-3px] bg-gray-600" : "w-1 right-[-2px] bg-gray-400"
  );

  return <div className={className}></div>;
};

export default FretWire;