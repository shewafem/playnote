// app/page.tsx
"use client"; // Or ensure InteractiveFretboard is treated as a client component boundary

import InteractiveFretboard from "@/components/fretboard/index"; // Adjusted path
import { Suspense } from 'react';


export default function FretboardPage() {
  return (
    // useSearchParams hook should be used within a Suspense boundary
    <Suspense>
      <InteractiveFretboard />
    </Suspense>
  );
}