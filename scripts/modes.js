import { state } from './state.js';

export function buildPyramidSequence() {
  const p = state.config.pyramid;
  const start = Math.max(1, p.start);
  const peak  = Math.max(start, p.peak);
  const step  = Math.max(1, p.step);
  const seq = [];
  for (let v = start; v <= peak; v += step) seq.push(v);
  if (state.options.pyramidUpDown) {
    for (let v = peak - step; v >= start; v -= step) seq.push(v);
  }
  return seq;
}

export function buildRoundTargets() {
  const m = state.mode;
  const c = state.config[m];
  if (m === 'sprint')  return [c.target];
  if (m === 'tabata')  return Array(c.rounds).fill(c.target || 0);
  if (m === 'series')  return Array(c.rounds).fill(c.reps);
  if (m === 'emom')    return Array(c.rounds).fill(c.reps);
  if (m === 'pyramid') return buildPyramidSequence();
  if (m === 'random') {
    const lo = Math.min(c.min, c.max);
    const hi = Math.max(c.min, c.max);
    if (c.totalCap > 0) {
      const targets = [];
      let remaining = c.totalCap;
      let safety = 0;
      while (remaining > 0 && safety < 500) {
        safety++;
        const drawn  = Math.floor(Math.random() * (hi - lo + 1)) + lo;
        const capped = Math.min(drawn, remaining);
        targets.push(capped);
        remaining -= capped;
      }
      return targets;
    }
    return Array.from({ length: c.rounds }, () =>
      Math.floor(Math.random() * (hi - lo + 1)) + lo);
  }
  return [];
}
