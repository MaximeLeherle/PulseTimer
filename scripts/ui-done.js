import { state } from './state.js';
import { formatTime } from './utils.js';
import { t } from './i18n.js';

export function renderDoneScreen() {
  const totalDur = (performance.now() - state.sessionStart) / 1000;
  const rounds   = state.roundCounts.length;
  const best     = rounds ? Math.max(...state.roundCounts) : 0;

  document.getElementById('done-total').textContent    = state.totalCount;
  document.getElementById('done-rounds').textContent   = rounds;
  document.getElementById('done-duration').textContent = formatTime(totalDur);
  document.getElementById('done-best').textContent     = best;

  const bd = document.getElementById('done-breakdown');
  if (state.roundCounts.length > 1) {
    const rows = state.roundCounts.map((c, i) => {
      const t = state.roundTargets[i] || 0;
      let cls = '', hint = '';
      if (t > 0) {
        if (c === t)      { cls = 'bd-hit';   hint = '✓'; }
        else if (c > t)   { cls = 'bd-over';  hint = `+${c - t}`; }
        else              { cls = 'bd-under'; hint = `−${t - c}`; }
      }
      return `<tr>
        <td>#${i + 1}</td>
        <td>${t > 0 ? t : '—'}</td>
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
