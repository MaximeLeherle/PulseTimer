import { state } from './state.js';
import { loadSettings } from './storage.js';
import { ensureAudio, requestWakeLock } from './audio.js';
import { applyTheme, applySettingsToUI, updateSummaries, updatePyramidPreview, initHome } from './ui-home.js';
import { startSession, initTimer } from './timer.js';
import { showScreen } from './screens.js';

document.getElementById('done-close-btn').addEventListener('click', () => showScreen('main'));
document.getElementById('done-finish-btn').addEventListener('click', () => showScreen('main'));
document.getElementById('done-restart-btn').addEventListener('click', () => {
  showScreen('main');
  setTimeout(() => { ensureAudio(); startSession(); }, 100);
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.running) requestWakeLock();
});

loadSettings();
applyTheme();
applySettingsToUI();
updateSummaries();
updatePyramidPreview();
initHome(() => { ensureAudio(); startSession(); });
initTimer();
