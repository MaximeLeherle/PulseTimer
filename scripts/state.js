export const DEFAULT_OPTIONS = {
  countdown: true,
  sound: true,
  lastSeconds: true,
  voice: false,
  vibrate: true,
  wakeLock: true,
  volume: 60,
  repEstim: 2,
  pyramidUpDown: true,
  randomSurprise: false,
  randomTotalHidden: false,
  theme: 'dark',
};

export const DEFAULT_CONFIG = {
  sprint:  { target: 20, duration: 60 },
  tabata:  { work: 20, rest: 10, rounds: 8, target: 0 },
  series:  { rounds: 5, reps: 10, rest: 60, cap: 0 },
  random:  { min: 5, max: 10, rounds: 10, rest: 30, cap: 0, totalCap: 0 },
  emom:    { reps: 10, period: 60, rounds: 10 },
  pyramid: { start: 1, peak: 10, step: 1, rest: 30 },
};

export const state = {
  mode: 'sprint',
  exercise: '',
  options: { ...DEFAULT_OPTIONS },
  config: JSON.parse(JSON.stringify(DEFAULT_CONFIG)),

  running: false,
  paused: false,
  phase: 'idle',
  currentRound: 0,
  totalRounds: 0,
  roundCounts: [],
  roundTargets: [],
  totalCount: 0,
  totalGoal: 0,
  phaseDuration: 0,
  phaseTarget: 0,
  phaseStart: 0,
  pausedElapsed: 0,
  sessionStart: 0,
  rafId: null,
  wakeLockObj: null,
  _pauseStart: 0,
  tapCount: 0,

  // Workout runtime
  activeWorkout: null,       // { id, name, blocks } or null
  activeWorkoutBlock: -1,    // current block index (0-based), -1 = no workout
  draftWorkout: null,        // { name, blocks } during builder
};
