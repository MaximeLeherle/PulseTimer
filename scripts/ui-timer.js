import { state } from './state.js';
import { t } from './i18n.js';

const CIRCLE_LEN = 2 * Math.PI * 92;

export function setCircle(pct, variant = 'normal') {
  const bar = document.getElementById('circle-bar');
  bar.classList.remove('rest', 'warn');
  if (variant === 'rest') bar.classList.add('rest');
  else if (variant === 'warn') bar.classList.add('warn');
  bar.setAttribute('stroke-dashoffset', CIRCLE_LEN * (1 - Math.max(0, Math.min(1, pct))));
}

export function buildSeriesTracker() {
  const wrap = document.getElementById('series-tracker');
  wrap.innerHTML = '';
  if (state.totalRounds <= 1) return;

  if (state.totalRounds > 8) {
    const done = state.roundCounts.length;
    const pct  = Math.round((done / state.totalRounds) * 100);
    wrap.innerHTML = `
      <div class="tracker-compact">
        <div class="tracker-compact-header">
          <span class="tracker-compact-label">${t('tracker.series')}</span>
          <span class="tracker-compact-num">${state.currentRound}<span class="tracker-compact-total"> / ${state.totalRounds}</span></span>
        </div>
        <div class="tracker-mini-bar">
          <div class="tracker-mini-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
    return;
  }

  for (let i = 0; i < state.totalRounds; i++) {
    const dot    = document.createElement('div');
    dot.className = 'series-bubble';
    const target = state.roundTargets[i] || 0;
    const count  = state.roundCounts[i];
    const isRandom          = state.mode === 'random';
    const isSurpriseCurrent = isRandom && state.options.randomSurprise;

    if (i + 1 < state.currentRound || (i + 1 === state.currentRound && state.phase === 'rest')) {
      if (count !== undefined) {
        dot.textContent = count;
        if (target > 0 && count > target)      dot.classList.add('over');
        else if (target > 0 && count < target) dot.classList.add('under');
        else                                   dot.classList.add('done');
      } else {
        dot.classList.add('done');
        dot.textContent = '✓';
      }
    } else if (i + 1 === state.currentRound && state.phase === 'work') {
      dot.classList.add('current');
      dot.textContent = isSurpriseCurrent ? '?' : (target > 0 ? target : '·');
    } else {
      dot.textContent = isRandom ? '·' : (target > 0 ? target : '·');
    }
    wrap.appendChild(dot);
  }
}

export function updateTotalBar() {
  const goal       = state.totalGoal;
  const isTotalCap = state.mode === 'random' && state.config.random.totalCap > 0;
  document.getElementById('total-current').textContent = state.totalCount;
  if (goal > 0) {
    const pct       = Math.min(100, (state.totalCount / goal) * 100);
    const remaining = Math.max(0, goal - state.totalCount);
    document.getElementById('total-bar-fill').style.width = pct + '%';
    document.getElementById('total-pct').textContent =
      isTotalCap ? `${remaining} rest.` : Math.round(pct) + '%';
  } else {
    document.getElementById('total-bar-fill').style.width = '0%';
    document.getElementById('total-pct').textContent = '—';
  }
  buildSeriesTracker();
}
