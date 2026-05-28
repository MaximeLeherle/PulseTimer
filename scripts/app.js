import { state } from './state.js';
import { loadSettings } from './storage.js';
import { ensureAudio, requestWakeLock } from './audio.js';
import { applyTheme, applySettingsToUI, updateSummaries, updatePyramidPreview, initHome } from './ui-home.js';
import { startSession, initTimer } from './timer.js';
import { showScreen } from './screens.js';
import { getLang, setLang, applyTranslations } from './i18n.js';

document.getElementById('done-close-btn').addEventListener('click', () => showScreen('main'));
document.getElementById('done-finish-btn').addEventListener('click', () => showScreen('main'));
document.getElementById('done-restart-btn').addEventListener('click', () => {
  showScreen('main');
  setTimeout(() => { ensureAudio(); startSession(); }, 100);
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
initHome(() => { ensureAudio(); startSession(); });
initTimer();
