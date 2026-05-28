import { state } from './state.js';
import { sounds, speak, vibrate, requestWakeLock, releaseWakeLock } from './audio.js';
import { formatTime, showToast } from './utils.js';
import { buildRoundTargets } from './modes.js';
import { showScreen, screens } from './screens.js';
import { setCircle, buildSeriesTracker, updateTotalBar } from './ui-timer.js';
import { renderDoneScreen } from './ui-done.js';
import { t } from './i18n.js';
import { saveSession } from './history.js';

// ---- Countdown ----
function startCountdown() {
  state.phase = 'countdown';
  document.getElementById('timer-phase').textContent = t('phase.ready');
  document.getElementById('timer-phase').className   = 'timer-phase countdown';
  document.getElementById('effort-target').innerHTML = '';
  setCircle(0, 'warn');

  let n       = 3;
  const big   = document.getElementById('big-time');
  big.className   = 'big-time countdown';
  big.textContent = n;
  sounds.countdown();
  speak(t('speech.three'));

  const iv = setInterval(() => {
    if (!state.running) { clearInterval(iv); return; }
    if (state.paused) return;
    n--;
    if (n > 0) {
      big.textContent = n;
      sounds.countdown();
      speak(n === 2 ? t('speech.two') : t('speech.one'));
    } else if (n === 0) {
      big.textContent = 'GO';
      sounds.go();
      speak(t('speech.go'));
    } else {
      clearInterval(iv);
      startWorkPhase();
    }
  }, 1000);
}

// ---- Work phase ----
function startWorkPhase() {
  state.phase         = 'work';
  state.currentRound++;
  state.phaseStart    = performance.now();
  state.pausedElapsed = 0;

  const m      = state.mode;
  const target = state.roundTargets[state.currentRound - 1] || 0;
  let duration = 0;

  if      (m === 'sprint')  duration = state.config.sprint.duration;
  else if (m === 'tabata')  duration = state.config.tabata.work;
  else if (m === 'series')  duration = state.config.series.cap;
  else if (m === 'random')  duration = state.config.random.cap;
  else if (m === 'emom')    duration = state.config.emom.period;

  state.phaseDuration = duration;
  state.phaseTarget   = target;
  state.tapCount      = 0;

  const isSurprise = m === 'random' && state.options.randomSurprise;
  const isFree     = duration === 0;

  document.getElementById('tap-zone').style.display             = isFree ? '' : 'none';
  document.getElementById('progress-circle-wrap').style.display = isFree ? 'none' : '';
  if (isFree) {
    document.getElementById('tap-count').textContent       = '0';
    document.getElementById('tap-target-hint').textContent =
      isSurprise ? '? REPS' : (target > 0 ? `/ ${target}` : '');
  }

  const phaseEl = document.getElementById('timer-phase');
  if      (m === 'sprint')  phaseEl.textContent = t('phase.sprint');
  else if (m === 'tabata')  phaseEl.textContent = `${t('phase.effort')} ${state.currentRound}/${state.totalRounds}`;
  else if (m === 'emom')    phaseEl.textContent = `${t('phase.min')} ${state.currentRound}/${state.totalRounds}`;
  else                      phaseEl.textContent = `${t('phase.series')} ${state.currentRound}/${state.totalRounds}`;
  phaseEl.className = 'timer-phase';

  document.getElementById('big-time').className = 'big-time';

  const tgEl = document.getElementById('effort-target');
  if (isSurprise) {
    tgEl.innerHTML = `<strong>?</strong> REPS 🎲`;
  } else if (target > 0) {
    tgEl.innerHTML = `<strong>${target}</strong> REPS`;
    if (m === 'random') tgEl.innerHTML += ' 🎲';
  } else {
    tgEl.innerHTML = t('phase.free');
  }

  document.getElementById('next-btn').textContent = t('btn.next');
  setCircle(0, 'normal');
  buildSeriesTracker();
  sounds.go();
  if (!isSurprise && m === 'random' && target > 0) speak(t('speech.n_reps', { n: target }));
  else if (target > 0) speak(t('speech.go'));
  vibrate(50);
  tickLoop();
}

// ---- Rest phase ----
function startRestPhase() {
  state.phase         = 'rest';
  state.phaseStart    = performance.now();
  state.pausedElapsed = 0;

  const m = state.mode;
  let duration = 0;
  if      (m === 'tabata')  duration = state.config.tabata.rest;
  else if (m === 'series')  duration = state.config.series.rest;
  else if (m === 'random')  duration = state.config.random.rest;
  else if (m === 'pyramid') duration = state.config.pyramid.rest;
  state.phaseDuration = duration;

  if (duration <= 0) { startWorkPhase(); return; }

  document.getElementById('tap-zone').style.display             = 'none';
  document.getElementById('progress-circle-wrap').style.display = '';
  document.getElementById('next-btn').textContent    = t('btn.skip');
  document.getElementById('timer-phase').textContent = t('phase.rest');
  document.getElementById('timer-phase').className   = 'timer-phase rest';
  document.getElementById('big-time').className      = 'big-time rest';
  document.getElementById('effort-target').innerHTML = '';
  setCircle(0, 'rest');
  sounds.rest();
  speak(t('speech.rest'));
  vibrate([30, 30, 30]);
  tickLoop();
}

// ---- Tick loop ----
let lastWholeSecond = -1;
function tickLoop() {
  cancelAnimationFrame(state.rafId);
  lastWholeSecond = -1;

  function loop() {
    if (!state.running) return;
    if (state.paused) { state.rafId = requestAnimationFrame(loop); return; }

    const elapsed  = (performance.now() - state.phaseStart - state.pausedElapsed) / 1000;
    const duration = state.phaseDuration;

    let remaining, pct;
    if (duration === 0) {
      remaining = -1;
      pct       = 0;
      document.getElementById('big-time').textContent = formatTime(elapsed);
    } else {
      remaining = duration - elapsed;
      pct       = elapsed / duration;
      document.getElementById('big-time').textContent = formatTime(remaining);
    }

    setCircle(pct, state.phase === 'rest' ? 'rest' : 'normal');

    if (state.options.lastSeconds && remaining > 0 && remaining <= 3) {
      const sec = Math.ceil(remaining);
      if (sec !== lastWholeSecond) {
        lastWholeSecond = sec;
        if (state.phase === 'work') {
          document.getElementById('big-time').classList.add('warn');
          setCircle(pct, 'warn');
          sounds.tick();
        } else if (state.phase === 'rest') {
          sounds.tick();
        }
      }
    }

    let phaseEnded = false;
    if (state.phase === 'work' && duration > 0 && remaining <= 0) phaseEnded = true;
    if (state.phase === 'rest' && remaining <= 0)                  phaseEnded = true;

    if (phaseEnded) { onPhaseEnd(); return; }
    state.rafId = requestAnimationFrame(loop);
  }
  state.rafId = requestAnimationFrame(loop);
}

// ---- Phase end ----
function onPhaseEnd() {
  if (state.phase === 'work') {
    cancelAnimationFrame(state.rafId);
    showInputScreen();
  } else if (state.phase === 'rest') {
    startWorkPhase();
  }
}

// ---- Input screen ----
function showInputScreen() {
  state.phase  = 'input';
  const target = state.phaseTarget;

  document.getElementById('input-phase').textContent =
    state.mode === 'sprint'
      ? t('input.phase.sprint')
      : t('input.phase.series', { round: state.currentRound, total: state.totalRounds });

  const isSurpriseInput = state.mode === 'random' && state.options.randomSurprise;
  const tgEl = document.getElementById('input-target-value');
  if (isSurpriseInput && target > 0) {
    tgEl.innerHTML = `${t('input.surprise_reveal')} <strong style="color:var(--accent);font-size:28px">${target}</strong>`;
  } else {
    tgEl.textContent = target > 0 ? t('input.objective', { n: target }) : t('input.free');
  }

  const inputEl  = document.getElementById('input-count');
  const wasFree  = state.phaseDuration === 0;
  inputEl.value  = isSurpriseInput
    ? (wasFree ? state.tapCount : 0)
    : (wasFree ? state.tapCount : (target > 0 ? target : 0));
  setTimeout(() => { inputEl.focus(); inputEl.select(); }, 100);

  document.getElementById('input-skip-rest-btn').style.display =
    state.currentRound >= state.totalRounds ? 'none' : '';

  screens.timer.classList.remove('active');
  screens.input.classList.add('active');
}

function validateInput(skipRest = false) {
  const val = Math.max(0, parseInt(document.getElementById('input-count').value) || 0);
  state.roundCounts.push(val);
  state.totalCount += val;
  updateTotalBar();

  if (state.mode === 'random' && state.options.randomSurprise) {
    const target = state.phaseTarget;
    if (target > 0) {
      const diff = val - target;
      if (diff === 0)    showToast(t('toast.perfect', { n: target }));
      else if (diff > 0) showToast(t('toast.over', { n: diff }));
      else               showToast(t('toast.under', { target, n: Math.abs(diff) }));
    }
  }

  screens.input.classList.remove('active');

  if (state.currentRound >= state.totalRounds) { finishSession(); return; }

  screens.timer.classList.add('active');

  const m = state.mode;
  let restDur = 0;
  if      (m === 'tabata')  restDur = state.config.tabata.rest;
  else if (m === 'series')  restDur = state.config.series.rest;
  else if (m === 'random')  restDur = state.config.random.rest;
  else if (m === 'pyramid') restDur = state.config.pyramid.rest;

  if (skipRest || restDur <= 0 || m === 'emom') startWorkPhase();
  else startRestPhase();
}

// ---- Session start / abort ----
export function startSession() {
  state.running       = true;
  state.paused        = false;
  state.totalCount    = 0;
  state.roundCounts   = [];
  state.roundTargets  = buildRoundTargets();
  state.totalRounds   = state.roundTargets.length;
  state.totalGoal     = state.roundTargets.reduce((a, b) => a + b, 0);
  state.currentRound  = 0;
  state.sessionStart  = performance.now();
  state.pausedElapsed = 0;

  const surpriseActive = state.mode === 'random' && state.options.randomSurprise;
  const totalHidden    = state.mode === 'random' && state.options.randomTotalHidden;
  document.getElementById('total-wrap').style.display =
    state.totalRounds > 1 && state.totalGoal > 0 && !surpriseActive && !totalHidden ? '' : 'none';
  document.getElementById('total-goal').textContent = state.totalGoal;
  updateTotalBar();

  document.getElementById('timer-exercise').textContent             = state.exercise || '';
  document.getElementById('tap-zone').style.display                 = 'none';
  document.getElementById('progress-circle-wrap').style.display     = '';
  showScreen('timer');
  requestWakeLock();
  buildSeriesTracker();

  if (state.options.countdown) startCountdown();
  else startWorkPhase();
}

export function abortSession() {
  state.running = false;
  cancelAnimationFrame(state.rafId);
  releaseWakeLock();
  showScreen('main');
}

function finishSession() {
  state.running = false;
  cancelAnimationFrame(state.rafId);
  releaseWakeLock();
  state.phase = 'done';
  sounds.done();
  speak(t('speech.done'));
  vibrate([100, 50, 100, 50, 200]);

  saveSession({
    id: Date.now().toString(36),
    date: new Date().toISOString(),
    exercise: state.exercise,
    mode: state.mode,
    roundTargets: [...state.roundTargets],
    roundCounts:  [...state.roundCounts],
    totalReps: state.totalCount,
    durationSec: Math.round((performance.now() - state.sessionStart) / 1000),
    workoutId:    state.activeWorkout?.id    ?? null,
    workoutBlock: state.activeWorkout != null ? state.activeWorkoutBlock : null,
  });

  renderDoneScreen();
  showScreen('done');
}

// ---- Timer + input screen events ----
export function initTimer() {
  document.getElementById('close-btn').addEventListener('click', () => abortSession());

  document.getElementById('pause-btn').addEventListener('click', () => {
    if (!state.running) return;
    state.paused = !state.paused;
    if (state.paused) {
      state._pauseStart = performance.now();
      document.getElementById('pause-btn').textContent = t('btn.resume');
    } else {
      state.pausedElapsed += performance.now() - state._pauseStart;
      document.getElementById('pause-btn').textContent = t('btn.pause');
    }
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    if (!state.running) return;
    onPhaseEnd();
  });

  document.getElementById('tap-btn').addEventListener('click', () => {
    if (!state.running || state.paused || state.phase !== 'work') return;
    state.tapCount++;
    document.getElementById('tap-count').textContent = state.tapCount;
    sounds.click();
    const isSurp = state.mode === 'random' && state.options.randomSurprise;
    if (!isSurp && state.phaseTarget > 0 && state.tapCount >= state.phaseTarget) {
      onPhaseEnd();
    }
  });

  document.getElementById('tap-undo-btn').addEventListener('click', () => {
    if (state.tapCount <= 0) return;
    state.tapCount--;
    document.getElementById('tap-count').textContent = state.tapCount;
  });

  document.getElementById('done-phase-btn').addEventListener('click', () => {
    if (!state.running || state.paused || state.phase !== 'work') return;
    onPhaseEnd();
  });

  document.getElementById('input-validate-btn').addEventListener('click', () => validateInput(false));
  document.getElementById('input-skip-rest-btn').addEventListener('click', () => validateInput(true));
  document.getElementById('input-close-btn').addEventListener('click', () => {
    screens.input.classList.remove('active');
    abortSession();
  });
  document.getElementById('input-zero-btn').addEventListener('click', () => {
    document.getElementById('input-count').value = 0;
    sounds.click();
  });
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputEl = document.getElementById('input-count');
      inputEl.value = Math.max(0, (parseInt(inputEl.value) || 0) + parseInt(btn.dataset.add));
      sounds.click();
    });
  });
  document.getElementById('input-count').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); validateInput(false); }
  });
}
