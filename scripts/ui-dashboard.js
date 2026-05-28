import { getHistory, clearHistory } from './history.js';

const MODE_LABELS = {
  sprint: 'Sprint', tabata: 'Tabata', series: 'Séries',
  random: 'Aléatoire', emom: 'EMOM', pyramid: 'Pyramide',
};

// Local YYYY-MM-DD from any Date or ISO string
function localDay(d = new Date()) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function relativeDate(isoStr) {
  const diff = Math.floor((Date.now() - new Date(isoStr)) / 86400000);
  if (diff === 0) return "Auj.";
  if (diff === 1) return 'Hier';
  if (diff < 7)  return `${diff}j`;
  const d = new Date(isoStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function fmtTime(sec) {
  if (sec < 60)  return sec + 's';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return h + 'h' + (m ? m + 'min' : '');
  return m + 'min';
}

function groupByDay(history) {
  const map = {};
  history.forEach(s => {
    const k = localDay(s.date);
    (map[k] = map[k] || []).push(s);
  });
  return map;
}

function groupByExercise(history) {
  const map = {};
  history.forEach(s => {
    const k = (s.exercise || '—').trim();
    (map[k] = map[k] || []).push(s);
  });
  return map;
}

function calcStreak(byDay) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (byDay[localDay(d)]) streak++;
    else if (i > 0) break;
  }
  return streak;
}

// ---- Public ----

export function renderDashboard() {
  const history = getHistory();
  const empty   = document.getElementById('dash-empty');
  const content = document.getElementById('dash-content');

  if (!history.length) {
    empty.style.display   = '';
    content.style.display = 'none';
    return;
  }
  empty.style.display   = 'none';
  content.style.display = '';

  const byDay = groupByDay(history);
  const byEx  = groupByExercise(history);

  // Global stats
  document.getElementById('dash-stat-sessions').textContent = history.length;
  document.getElementById('dash-stat-reps').textContent     = history.reduce((a, s) => a + s.totalReps, 0);
  document.getElementById('dash-stat-time').textContent     = fmtTime(history.reduce((a, s) => a + s.durationSec, 0));
  document.getElementById('dash-stat-streak').textContent   = calcStreak(byDay) + 'j';

  renderGrid(byDay);
  renderExercises(byEx);
  renderHistory(history.slice(0, 25));
}

function renderGrid(byDay) {
  const grid  = document.getElementById('dash-grid');
  const today = new Date();
  grid.innerHTML = '';
  for (let i = 34; i >= 0; i--) {
    const d     = new Date(today);
    d.setDate(d.getDate() - i);
    const key   = localDay(d);
    const count = byDay[key]?.length || 0;
    const cell  = document.createElement('div');
    cell.className = 'activity-cell' + (count >= 2 ? ' high' : count === 1 ? ' low' : '');
    cell.title = key + (count ? ` · ${count} séance${count > 1 ? 's' : ''}` : '');
    grid.appendChild(cell);
  }
}

function renderExercises(byEx) {
  const list   = document.getElementById('dash-exercises');
  const sorted = Object.entries(byEx).sort(
    (a, b) => b[1].reduce((s, x) => s + x.totalReps, 0) - a[1].reduce((s, x) => s + x.totalReps, 0)
  );
  list.innerHTML = sorted.map(([name, sessions]) => {
    const total = sessions.reduce((s, x) => s + x.totalReps, 0);
    const best  = Math.max(...sessions.flatMap(s => s.roundCounts.length ? s.roundCounts : [0]));
    const last  = relativeDate(sessions[0].date);
    const nb    = sessions.length;
    return `<div class="dash-ex-row">
      <div class="dash-ex-name">${name}</div>
      <div class="dash-ex-meta">
        <span class="dash-pill">${total} reps</span>
        <span class="dash-pill">${nb} séance${nb > 1 ? 's' : ''}</span>
        <span class="dash-pill">Best ${best > 0 ? best : '—'}</span>
        <span class="dash-pill muted">${last}</span>
      </div>
    </div>`;
  }).join('');
}

function renderHistory(sessions) {
  const list = document.getElementById('dash-history');
  list.innerHTML = sessions.map(s => {
    const time = new Date(s.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `<div class="dash-row">
      <div class="dash-row-date">
        <span class="dr-rel">${relativeDate(s.date)}</span>
        <span class="dr-time">${time}</span>
      </div>
      <div class="dash-row-info">
        <span class="dr-exercise">${s.exercise || '—'}</span>
        <span class="dr-mode">${MODE_LABELS[s.mode] || s.mode}</span>
      </div>
      <div class="dash-row-stats">
        <span class="dr-reps">${s.totalReps}</span>
        <span class="dr-dur">${fmtTime(s.durationSec)}</span>
      </div>
    </div>`;
  }).join('');
}

export function initDashboard(onClose) {
  document.getElementById('dash-close-btn').addEventListener('click', onClose);
  document.getElementById('dash-clear-btn').addEventListener('click', () => {
    if (confirm('Vider tout l\'historique ?')) {
      clearHistory();
      renderDashboard();
    }
  });
}
