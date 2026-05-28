import { state } from './state.js';
import { loadSettings } from './storage.js';
import { ensureAudio, requestWakeLock } from './audio.js';
import { applyTheme, applySettingsToUI, updateSummaries, updatePyramidPreview, initHome } from './ui-home.js';
import { startSession, initTimer } from './timer.js';
import { showScreen } from './screens.js';
import { getLang, setLang, applyTranslations } from './i18n.js';
import { renderWorkouts, initWorkoutBuilder, loadNextBlock, stopWorkout } from './ui-workouts.js';
import { renderDashboard, initDashboard } from './ui-dashboard.js';

// Done screen buttons — behaviour depends on active workout
document.getElementById('done-close-btn').addEventListener('click', () => {
  stopWorkout();
  showScreen('main');
});
document.getElementById('done-finish-btn').addEventListener('click', () => {
  const w = state.activeWorkout;
  if (w && state.activeWorkoutBlock < w.blocks.length - 1) {
    // Advance to next block
    loadNextBlock();
    showScreen('main');
  } else {
    stopWorkout();
    showScreen('main');
  }
});
document.getElementById('done-restart-btn').addEventListener('click', () => {
  const w = state.activeWorkout;
  if (w && state.activeWorkoutBlock < w.blocks.length - 1) {
    // Skip this block, advance
    loadNextBlock();
    showScreen('main');
  } else {
    stopWorkout();
    showScreen('main');
    setTimeout(() => { ensureAudio(); startSession(); }, 100);
  }
});

document.getElementById('stats-btn').addEventListener('click', () => {
  renderDashboard();
  showScreen('dashboard');
});

document.getElementById('lang-btn').addEventListener('click', () => {
  setLang(getLang() === 'fr' ? 'en' : 'fr');
  applyTranslations();
  updateSummaries();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.running) requestWakeLock();
});

loadSettings();
applyTheme();
applySettingsToUI();
applyTranslations();
updateSummaries();
updatePyramidPreview();
document.getElementById('stop-workout-btn').addEventListener('click', () => {
  stopWorkout();
  renderWorkouts();
});

initDashboard(() => showScreen('main'));
renderWorkouts();
initWorkoutBuilder();
initHome(() => { ensureAudio(); startSession(); });
initTimer();
