export const LEVEL_THRESHOLDS = [0, 5, 15, 30, 50, 75, 100, 150, 300, 400, 500, 1000];

export const LEVEL_NAMES = [
	"Новичок",
	"Ученик",
	"Любитель",
	"Знаток",
	"Маэстро",
	"Виртуоз",
	"Легенда",
];

export interface LevelInfo {
	level: number;
	levelName: string;
	progress: number; 
	toNextLevel: number;
    currentLevelTotal: number;
    nextLevelThreshold: number;
}

export function calculateLevelInfo(learnedCount: number): LevelInfo {
	let currentLevel = 1;

	for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
		if (learnedCount >= LEVEL_THRESHOLDS[i]) {
			currentLevel = i + 1;
		} else {
			break;
		}
	}

    // Handle max level
	if (currentLevel >= LEVEL_THRESHOLDS.length) {
		return {
			level: currentLevel,
			levelName: LEVEL_NAMES[currentLevel - 1] || "Легенда",
			progress: 100,
			toNextLevel: 0,
            currentLevelTotal: learnedCount - LEVEL_THRESHOLDS[currentLevel - 1],
            nextLevelThreshold: learnedCount - LEVEL_THRESHOLDS[currentLevel - 1],
		};
	}

	const lowerBound = LEVEL_THRESHOLDS[currentLevel - 1];
	const upperBound = LEVEL_THRESHOLDS[currentLevel];

	const positionsInCurrentLevel = learnedCount - lowerBound;
	const positionsForNextLevel = upperBound - lowerBound;
	const progress = Math.floor((positionsInCurrentLevel / positionsForNextLevel) * 100);
    const toNextLevel = upperBound - learnedCount;

	return {
		level: currentLevel,
		levelName: LEVEL_NAMES[currentLevel - 1],
		progress,
		toNextLevel,
        currentLevelTotal: positionsInCurrentLevel,
        nextLevelThreshold: positionsForNextLevel,
	};
}