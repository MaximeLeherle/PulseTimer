const LS_HISTORY = 'pulsetimer-history-v1';
const MAX_SESSIONS = 200;

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]'); }
  catch { return []; }
}

export function saveSession(session) {
  const history = getHistory();
  history.unshift(session);
  if (history.length > MAX_SESSIONS) history.length = MAX_SESSIONS;
  localStorage.setItem(LS_HISTORY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(LS_HISTORY);
}
