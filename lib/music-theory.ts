// lib/music-theory.ts
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export type RomanNumeral = 'I' | 'ii' | 'iii' | 'IV' | 'V' | 'vi' | 'vii°';
export type ChordType = 'Major' | 'minor' | 'diminished';

export interface Chord {
  numeral: RomanNumeral;
  type: ChordType;
  rootNote: string; // The root note of this specific chord
  displayName: string; // e.g., "Cmaj", "Dm"
}

export interface ScaleChord extends Chord {
  degree: number; // 1-7
}

// Diatonic chords in a Major key
const MAJOR_SCALE_CHORD_QUALITIES: { numeral: RomanNumeral, type: ChordType }[] = [
  { numeral: 'I', type: 'Major' },
  { numeral: 'ii', type: 'minor' },
  { numeral: 'iii', type: 'minor' },
  { numeral: 'IV', type: 'Major' },
  { numeral: 'V', type: 'Major' },
  { numeral: 'vi', type: 'minor' },
  { numeral: 'vii°', type: 'diminished' },
];

export const getMajorScaleNotes = (rootNote: string): string[] => {
  const rootIndex = NOTES.indexOf(rootNote);
  if (rootIndex === -1) throw new Error('Invalid root note');

  const scaleSteps = [0, 2, 4, 5, 7, 9, 11]; // Major scale intervals (W-W-H-W-W-W-H)
  return scaleSteps.map(step => NOTES[(rootIndex + step) % NOTES.length]);
};

export const getDiatonicChords = (rootNote: string): ScaleChord[] => {
  const scaleNotes = getMajorScaleNotes(rootNote);
  return MAJOR_SCALE_CHORD_QUALITIES.map((quality, index) => {
    const chordRootNote = scaleNotes[index];
    let displayName = chordRootNote;
    if (quality.type === 'minor') displayName += 'm';
    if (quality.type === 'diminished') displayName += '°';

    return {
      ...quality,
      degree: index + 1,
      rootNote: chordRootNote,
      displayName: displayName,
    };
  });
};

export const POPULAR_PROGRESSIONS: { name: string; progression: RomanNumeral[] }[] = [
  { name: 'Classic Pop', progression: ['I', 'V', 'vi', 'IV'] },
  { name: '50s Progression', progression: ['I', 'vi', 'IV', 'V'] },
  { name: 'Pachelbel\'s Canon', progression: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'] },
  { name: 'Blues (12-bar basic)', progression: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'] },
  { name: 'Jazz Standard (ii-V-I)', progression: ['ii', 'V', 'I'] },
  { name: 'Minor Key Pop', progression: ['vi', 'IV', 'I', 'V'] }, // Often relative to major
];

export const getRandomProgression = (maxLength: number = 4): RomanNumeral[] => {
  const availableNumerals: RomanNumeral[] = ['I', 'ii', 'iii', 'IV', 'V', 'vi']; // Excluding vii° for simplicity in random generation
  const length = Math.floor(Math.random() * (maxLength - 2)) + 3; // Generate 3 to maxLength chords
  const progression: RomanNumeral[] = [];
  for (let i = 0; i < length; i++) {
    progression.push(availableNumerals[Math.floor(Math.random() * availableNumerals.length)]);
  }
  // Ensure it often starts with I or vi for more musical results
  if (Math.random() > 0.3 && progression.length > 0) {
    progression[0] = Math.random() > 0.5 ? 'I' : 'vi';
  }
  return progression;
};