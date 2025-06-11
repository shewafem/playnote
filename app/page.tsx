import { Feature } from "@/components/pages/feature";
import Hero from "@/components/pages/hero";
//import { Chord, Midi } from "tonal";
export default async function Home() {
	//const session = await auth();
	//console.log(session?.user);
  //console.log(Chord.detect([48,52,58,60,65].map(midi => Midi.midiToNoteName(midi))));
	return (
		<>
			<Hero />
			<Feature />
		</>
	);
}
