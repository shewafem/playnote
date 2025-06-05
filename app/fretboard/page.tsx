// app/page.tsx
"use client"; // Or ensure InteractiveFretboard is treated as a client component boundary

import InteractiveFretboard from "@/components/fretboard/index"; // Adjusted path
import { Suspense } from 'react';

// A simple component to wrap InteractiveFretboard, ensuring it's part of the Suspense boundary
function FretboardContent() {
  return <InteractiveFretboard />;
}

export default function FretboardPage() {
  return (
    // useSearchParams hook should be used within a Suspense boundary
    <Suspense fallback={<div>Загружаю гриф...</div>}>
      <FretboardContent />
    </Suspense>
  );
}