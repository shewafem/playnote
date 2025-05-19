"use client"

import { useEffect, useRef, useState } from "react";
import { AlphaTabApi, Settings } from "@coderline/alphatab";
import { Container } from "../layout/container";

export default function AlphaTabPlayer() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<AlphaTabApi>();

  useEffect(() => {
    const api = new AlphaTabApi(elementRef.current!, {
      core: {
        file: 'https://www.alphatab.net/files/canon.gp',
        fontDirectory: '/alphatab/font/'
      },
      player: {
        enablePlayer: true,
        enableCursor: true,
        enableUserInteraction: true,
        soundFont: '/alphatab/soundfont/sonivox.sf2'
      }
    } as Settings);
    
    setApi(api);

    return () => {
      console.log('destroy', elementRef, api);
      api.destroy();
    }
  }, []);

  function playPause() {
    api?.playPause();
  }
  
  return (
    <>
        <Container className="at-content overflow-auto flex flex-col gap-4">
          <button className="bg-primary p-3 text-background w-fit rounded-lg cursor-pointer" onClick={() => playPause()}>Играть/Стоп</button>
          <div ref={elementRef} className="h-fit border rounded-lg shadow-md"></div>
        </Container>
    </>
  );
}