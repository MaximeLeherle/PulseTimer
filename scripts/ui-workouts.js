import { state } from './state.js';
import { getWorkouts, addWorkout, deleteWorkout } from './workouts.js';
import { t } from './i18n.js';
import { applySettingsToUI } from './ui-home.js';
import { updateSummaries, updatePyramidPreview } from './ui-home.js';

const MODE_LABELS = {
  sprint: 'Sprint', tabata: 'Tabata', series: 'Séries',
  random: 'Aléatoire', emom: 'EMOM', pyramid: 'Pyramide',
};

// ---- Render ----

export function renderWorkouts() {
  const workouts = getWorkouts();
  const chips    = document.getElementById('workout-chips');
  chips.innerHTML = '';

  workouts.forEach(w => {
    const chip = document.createElement('button');
    chip.className = 'workout-chip' + (state.activeWorkout?.id === w.id ? ' active' : '');
    chip.innerHTML = `<span class="wc-name">${w.name}</span><span class="wc-count">${w.blocks.length} ex</span>`;
    chip.addEventListener('click', () => loadWorkout(w));
    chips.appendChild(chip);
  });

  renderActiveBanner();
}

function renderActiveBanner() {
  const banner = document.getElementById('active-workout-banner');
  const w      = state.activeWorkout;
  if (!w) { banner.style.display = 'none'; return; }
  const block = w.blocks[state.activeWorkoutBlock];
  banner.style.display = '';
  document.getElementById('banner-name').textContent =
    `${w.name} — ${state.activeWorkoutBlock + 1}/${w.blocks.length}`;
  document.getElementById('banner-exercise').textContent =
    `${block?.exercise || ''} · ${MODE_LABELS[block?.mode] || ''}`;
}

// ---- Load workout ----

export function loadWorkout(workout) {
  state.activeWorkout      = workout;
  state.activeWorkoutBlock = 0;
  loadBlock(workout.blocks[0]);
}

export function loadNextBlock() {
  if (!state.activeWorkout) return;
  state.activeWorkoutBlock++;
  const block = state.activeWorkout.blocks[state.activeWorkoutBlock];
  if (block) loadBlock(block);
  else stopWorkout();
}

export function stopWorkout() {
  state.activeWorkout      = null;
  state.activeWorkoutBlock = -1;
  renderWorkouts();
}

function loadBlock(block) {
  state.exercise = block.exercise;
  state.mode     = block.mode;
  Object.assign(state.config[block.mode], block.config);
  applySettingsToUI();
  updateSummaries();
  updatePyramidPreview();
  renderWorkouts();
}

// ---- Builder ----

export function initWorkoutBuilder() {
  document.getElementById('new-workout-btn').addEventListener('click', openBuilder);
  document.getElementById('cancel-builder-btn').addEventListener('click', closeBuilder);
  document.getElementById('save-workout-btn').addEventListener('click', saveWorkout);
  document.getElementById('add-block-btn').addEventListener('click', addCurrentBlock);
}

function openBuilder() {
  state.draftWorkout = { name: '', blocks: [] };
  document.getElementById('workout-builder').style.display = '';
  document.getElementById('workout-name-input').focus();
  renderBuilderBlocks();
}

function closeBuilder() {
  state.draftWorkout = null;
  document.getElementById('workout-builder').style.display = 'none';
}

function addCurrentBlock() {
  if (!state.draftWorkout) return;
  state.draftWorkout.blocks.push({
    exercise: state.exercise,
    mode:     state.mode,
    config:   JSON.parse(JSON.stringify(state.config[state.mode])),
  });
  renderBuilderBlocks();
}

function renderBuilderBlocks() {
  const list = document.getElementById('builder-blocks');
  const blocks = state.draftWorkout?.blocks || [];
  list.innerHTML = blocks.map((b, i) => `
    <div class="builder-block">
      <span class="bb-num">${i + 1}</span>
      <span class="bb-info">
        <strong>${b.exercise || '—'}</strong>
        <span>${MODE_LABELS[b.mode] || b.mode}</span>
      </span>
      <button class="bb-del" data-i="${i}">✕</button>
    </div>`).join('');

  list.querySelectorAll('.bb-del').forEach(btn => {
    btn.addEventListener('click', () => {
      state.draftWorkout.blocks.splice(parseInt(btn.dataset.i), 1);
      renderBuilderBlocks();
    });
  });
}

function saveWorkout() {
  const name = document.getElementById('workout-name-input').value.trim();
  if (!name) {
    document.getElementById('workout-name-input').focus();
    return;
  }
  if (!state.draftWorkout?.blocks.length) return;
  addWorkout({
    id: Date.now().toString(36),
    name,
    blocks: state.draftWorkout.blocks,
  });
  closeBuilder();
  renderWorkouts();
}
