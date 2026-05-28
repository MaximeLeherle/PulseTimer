const LS_WORKOUTS = 'pulsetimer-workouts-v1';

export function getWorkouts() {
  try { return JSON.parse(localStorage.getItem(LS_WORKOUTS) || '[]'); }
  catch { return []; }
}

export function saveWorkouts(workouts) {
  localStorage.setItem(LS_WORKOUTS, JSON.stringify(workouts));
}

export function addWorkout(workout) {
  const workouts = getWorkouts();
  workouts.push(workout);
  saveWorkouts(workouts);
}

export function deleteWorkout(id) {
  saveWorkouts(getWorkouts().filter(w => w.id !== id));
}

export function updateWorkout(updated) {
  saveWorkouts(getWorkouts().map(w => w.id === updated.id ? updated : w));
}
