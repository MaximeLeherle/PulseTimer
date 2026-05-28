import { state } from './state.js';
import { formatTime } from './utils.js';
import { t } from './i18n.js';

const MODE_LABELS = {
  sprint: 'Sprint', tabata: 'Tabata', series: 'Séries',
  random: 'Aléatoire', emom: 'EMOM', pyramid: 'Pyramide',
};

export function renderDoneScreen() {
  const totalDur = (performance.now() - state.sessionStart) / 1000;
  const rounds   = state.roundCounts.length;
  const best     = rounds ? Math.max(...state.roundCounts) : 0;

  document.getElementById('done-total').textContent    = state.totalCount;
  document.getElementById('done-rounds').textContent   = rounds;
  document.getElementById('done-duration').textContent = formatTime(totalDur);
  document.getElementById('done-best').textContent     = best;

  // Workout next-block banner
  const nextWrap = document.getElementById('done-next-wrap');
  const w = state.activeWorkout;
  if (w && state.activeWorkoutBlock < w.blocks.length - 1) {
    const next = w.blocks[state.activeWorkoutBlock + 1];
    const idx  = state.activeWorkoutBlock + 2;
    nextWrap.style.display = '';
    document.getElementById('done-next-label').textContent =
      `${w.name} — ${idx}/${w.blocks.length}`;
    document.getElementById('done-next-exercise').textContent = next.exercise || '—';
    document.getElementById('done-next-mode').textContent =
      MODE_LABELS[next.mode] || next.mode;
    document.getElementById('done-restart-btn').textContent = t('btn.skip');
    document.getElementById('done-finish-btn').textContent  = '▶ ' + t('workout.next');
  } else if (w && state.activeWorkoutBlock === w.blocks.length - 1) {
    nextWrap.style.display = '';
    document.getElementById('done-next-label').textContent   = w.name;
    document.getElementById('done-next-exercise').textContent = '🏁 ' + t('workout.complete');
    document.getElementById('done-next-mode').textContent    = '';
    document.getElementById('done-restart-btn').textContent  = t('btn.restart');
    document.getElementById('done-finish-btn').textContent   = t('btn.finish');
  } else {
    nextWrap.style.display = 'none';
    document.getElementById('done-restart-btn').textContent = t('btn.restart');
    document.getElementById('done-finish-btn').textContent  = t('btn.finish');
  }

  // Breakdown table
  const bd = document.getElementById('done-breakdown');
  if (state.roundCounts.length > 1) {
    const rows = state.roundCounts.map((c, i) => {
      const tgt = state.roundTargets[i] || 0;
      let cls = '', hint = '';
      if (tgt > 0) {
        if (c === tgt)      { cls = 'bd-hit';   hint = '✓'; }
        else if (c > tgt)   { cls = 'bd-over';  hint = `+${c - tgt}`; }
        else                { cls = 'bd-under'; hint = `−${tgt - c}`; }
      }
      return `<tr>
        <td>#${i + 1}</td>
        <td>${tgt > 0 ? tgt : '—'}</td>
        <td class="${cls}">${c}</td>
        <td class="${cls}" style="color:var(--muted);font-size:11px">${hint}</td>
      </tr>`;
    }).join('');
    bd.innerHTML = `<table class="breakdown-table">
      <thead><tr><th>${t('done.col.set')}</th><th>${t('done.col.target')}</th><th>${t('done.col.done')}</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  } else {
    bd.innerHTML = '';
  }
}
