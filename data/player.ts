import * as Tone from "tone";

export const playChord = (midiNotes: number[]) => {
  const synth = new Tone.PolySynth().toDestination();
	const now = Tone.now();
	midiNotes.forEach((note, index) => {
		const noteName = Tone.Frequency(note, "midi").toNote();
		synth.triggerAttackRelease(noteName, "8n", now + index * 0.1);
	});
};
