import { state } from './state.js';
import { saveSettings } from './storage.js';
import { fmtDuration } from './utils.js';
import { buildPyramidSequence } from './modes.js';
import { t } from './i18n.js';

export function applyTheme() {
  document.body.classList.toggle('light', state.options.theme === 'light');
  document.querySelector('meta[name="theme-color"]').content =
    state.options.theme === 'light' ? '#f5f5f0' : '#0a0a0a';
}

const configBindings = [
  ['sprint-target',   'sprint',  'target'],
  ['sprint-duration', 'sprint',  'duration'],
  ['tabata-work',     'tabata',  'work'],
  ['tabata-rest',     'tabata',  'rest'],
  ['tabata-rounds',   'tabata',  'rounds'],
  ['tabata-target',   'tabata',  'target'],
  ['series-rounds',   'series',  'rounds'],
  ['series-reps',     'series',  'reps'],
  ['series-rest',     'series',  'rest'],
  ['series-cap',      'series',  'cap'],
  ['random-min',      'random',  'min'],
  ['random-max',      'random',  'max'],
  ['random-rounds',   'random',  'rounds'],
  ['random-rest',     'random',  'rest'],
  ['random-cap',      'random',  'cap'],
  ['random-totalcap', 'random',  'totalCap'],
  ['emom-reps',       'emom',    'reps'],
  ['emom-period',     'emom',    'period'],
  ['emom-rounds',     'emom',    'rounds'],
  ['pyramid-start',   'pyramid', 'start'],
  ['pyramid-peak',    'pyramid', 'peak'],
  ['pyramid-step',    'pyramid', 'step'],
  ['pyramid-rest',    'pyramid', 'rest'],
];

function summaryHTML(items) {
  return items.map(it => `
    <div class="item">
      <div class="item-label">${it.label}</div>
      <div class="item-value">${it.value}<span class="item-unit">${it.unit || ''}</span></div>
    </div>`).join('');
}

export function updatePyramidPreview() {
  const seq = buildPyramidSequence();
  document.getElementById('pyramid-preview').innerHTML =
    seq.map(n => `<div class="pyramid-step">${n}</div>`).join('');
}

export function updateSummaries() {
  const sp = state.config.sprint;
  document.getElementById('summary-sprint').innerHTML = summaryHTML([
    { label: t('summary.target'), value: sp.target, unit: t('unit.reps') },
    { label: t('summary.time'),   value: fmtDuration(sp.duration) },
    { label: t('summary.pace'),   value: sp.duration > 0 ? (sp.target / sp.duration).toFixed(2) : '—', unit: t('unit.per_sec') },
  ]);

  const tb = state.config.tabata;
  const tbTotalSec    = (tb.work + tb.rest) * tb.rounds - tb.rest;
  const tbTotalPompes = (tb.target || 0) * tb.rounds;
  document.getElementById('summary-tabata').innerHTML = summaryHTML([
    { label: tb.target > 0 ? t('summary.total') : t('summary.sets'), value: tb.target > 0 ? tbTotalPompes : tb.rounds, unit: tb.target > 0 ? t('unit.reps') : t('unit.times') },
    { label: t('summary.duration'),  value: fmtDuration(tbTotalSec) },
    { label: t('summary.effort'),    value: fmtDuration(tb.work * tb.rounds) },
  ]);

  const sr = state.config.series;
  const estimEffort = sr.cap > 0 ? sr.cap : sr.reps * state.options.repEstim;
  const srTotalSec  = estimEffort * sr.rounds + sr.rest * Math.max(0, sr.rounds - 1);
  document.getElementById('summary-series').innerHTML = summaryHTML([
    { label: t('summary.total'),    value: sr.reps * sr.rounds, unit: t('unit.reps') },
    { label: sr.cap > 0 ? t('summary.duration') : t('summary.duration_approx'), value: fmtDuration(srTotalSec) },
    { label: t('summary.rest'),     value: fmtDuration(sr.rest * Math.max(0, sr.rounds - 1)) },
  ]);

  const rd     = state.config.random;
  const rdMin  = Math.min(rd.min, rd.max);
  const rdMax  = Math.max(rd.min, rd.max);
  const rdAvg  = (rdMin + rdMax) / 2;
  const rdEstim = rd.cap > 0 ? rd.cap : rdAvg * state.options.repEstim;
  if (rd.totalCap > 0) {
    const estRounds  = Math.round(rd.totalCap / Math.max(1, rdAvg));
    const rdTotalSec = rdEstim * estRounds + rd.rest * Math.max(0, estRounds - 1);
    document.getElementById('summary-random').innerHTML = summaryHTML([
      { label: t('summary.total_target'), value: rd.totalCap, unit: t('unit.reps') },
      { label: t('summary.sets_approx'),  value: estRounds, unit: '' },
      { label: t('summary.duration_approx'), value: fmtDuration(rdTotalSec) },
    ]);
  } else {
    const rdTotalSec = rdEstim * rd.rounds + rd.rest * Math.max(0, rd.rounds - 1);
    document.getElementById('summary-random').innerHTML = summaryHTML([
      { label: t('summary.total_approx'), value: Math.round(rdAvg * rd.rounds), unit: t('unit.reps') },
      { label: t('summary.range'),        value: `${rdMin * rd.rounds}-${rdMax * rd.rounds}`, unit: '' },
      { label: t('summary.duration_approx'), value: fmtDuration(rdTotalSec) },
    ]);
  }

  const em = state.config.emom;
  document.getElementById('summary-emom').innerHTML = summaryHTML([
    { label: t('summary.total'),   value: em.reps * em.rounds, unit: t('unit.reps') },
    { label: t('summary.duration'), value: fmtDuration(em.period * em.rounds) },
    { label: t('summary.per_min'), value: em.reps, unit: t('unit.reps') },
  ]);

  const seq    = buildPyramidSequence();
  const pyTotal = seq.reduce((a, b) => a + b, 0);
  const py     = state.config.pyramid;
  const pyEstim = seq.reduce((a, b) => a + b * state.options.repEstim, 0)
    + py.rest * Math.max(0, seq.length - 1);
  document.getElementById('summary-pyramid').innerHTML = summaryHTML([
    { label: t('summary.total'),   value: pyTotal, unit: t('unit.reps') },
    { label: t('summary.levels'),  value: seq.length, unit: '' },
    { label: t('summary.duration_approx'), value: fmtDuration(pyEstim) },
  ]);
}

export function applySettingsToUI() {
  document.getElementById('exercise-input').value = state.exercise || '';
  document.querySelectorAll('.mode-card').forEach(c =>
    c.classList.toggle('active', c.dataset.mode === state.mode));
  document.querySelectorAll('.mode-config').forEach(c =>
    c.classList.toggle('active', c.id === 'config-' + state.mode));
  configBindings.forEach(([id, mode, key]) => {
    document.getElementById(id).value = state.config[mode][key];
  });
  document.getElementById('opt-volume').value    = state.options.volume;
  document.getElementById('opt-rep-estim').value = state.options.repEstim;
  document.querySelectorAll('.toggle').forEach(t => {
    t.classList.toggle('on', !!state.options[t.dataset.opt]);
  });
}

export function initHome(onStart) {
  document.getElementById('theme-btn').addEventListener('click', () => {
    state.options.theme = state.options.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveSettings();
  });

  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      state.mode = card.dataset.mode;
      document.querySelectorAll('.mode-card').forEach(c =>
        c.classList.toggle('active', c.dataset.mode === state.mode));
      document.querySelectorAll('.mode-config').forEach(c =>
        c.classList.toggle('active', c.id === 'config-' + state.mode));
      saveSettings();
    });
  });

  configBindings.forEach(([id, mode, key]) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      state.config[mode][key] = parseInt(el.value) || 0;
      saveSettings();
      updateSummaries();
      updatePyramidPreview();
    });
  });

  document.getElementById('opt-volume').addEventListener('input', e => {
    state.options.volume = parseInt(e.target.value) || 0;
    saveSettings();
  });
  document.getElementById('opt-rep-estim').addEventListener('input', e => {
    state.options.repEstim = parseInt(e.target.value) || 2;
    saveSettings();
    updateSummaries();
  });

  document.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', () => {
      const opt = t.dataset.opt;
      state.options[opt] = !state.options[opt];
      t.classList.toggle('on', state.options[opt]);
      saveSettings();
      updateSummaries();
      updatePyramidPreview();
    });
  });

  document.getElementById('exercise-input').addEventListener('input', e => {
    state.exercise = e.target.value.trim();
    saveSettings();
  });

  document.getElementById('start-btn').addEventListener('click', onStart);
}
