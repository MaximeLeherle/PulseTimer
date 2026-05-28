import { state } from './state.js';
import { t } from './i18n.js';

let audioCtx = null;

export function ensureAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq = 880, duration = 0.15, type = 'sine') {
  if (!state.options.sound) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const vol = state.options.volume / 100;
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(vol * 0.4, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export const sounds = {
  tick:      () => beep(660, 0.08, 'square'),
  go:        () => beep(1320, 0.25, 'sine'),
  rest:      () => beep(440, 0.25, 'sine'),
  countdown: () => beep(800, 0.12, 'square'),
  done:      () => { beep(880, 0.15); setTimeout(() => beep(1100, 0.15), 150); setTimeout(() => beep(1320, 0.3), 300); },
  click:     () => beep(1500, 0.04, 'square'),
};

export function speak(text) {
  if (!state.options.voice) return;
  if (!('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = t('speech.lang');
    u.rate = 1.1;
    u.volume = state.options.volume / 100;
    speechSynthesis.speak(u);
  } catch (e) {}
}

export function vibrate(pattern) {
  if (!state.options.vibrate) return;
  if (navigator.vibrate) navigator.vibrate(pattern);
}

export async function requestWakeLock() {
  if (!state.options.wakeLock) return;
  if (!('wakeLock' in navigator)) return;
  try { state.wakeLockObj = await navigator.wakeLock.request('screen'); } catch (e) {}
}

export function releaseWakeLock() {
  if (state.wakeLockObj) {
    state.wakeLockObj.release().catch(() => {});
    state.wakeLockObj = null;
  }
}
