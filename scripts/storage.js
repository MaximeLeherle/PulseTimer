import { state } from './state.js';

const LS_CONFIG = 'pompes-config-v2';

export function saveSettings() {
  try {
    localStorage.setItem(LS_CONFIG, JSON.stringify({
      mode: state.mode,
      exercise: state.exercise,
      options: state.options,
      config: state.config,
    }));
  } catch (e) {}
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_CONFIG);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.mode) state.mode = data.mode;
    if (data.exercise !== undefined) state.exercise = data.exercise;
    if (data.options) Object.assign(state.options, data.options);
    if (data.config) {
      for (const k in data.config) {
        if (state.config[k]) Object.assign(state.config[k], data.config[k]);
      }
    }
  } catch (e) {}
}
