export const screens = {
  main:  document.getElementById('main-screen'),
  timer: document.getElementById('timer-screen'),
  input: document.getElementById('input-screen'),
  done:  document.getElementById('done-screen'),
};

export function showScreen(name) {
  screens.main.style.display = (name === 'main') ? '' : 'none';
  ['timer', 'input', 'done'].forEach(s => {
    screens[s].classList.toggle('active', name === s);
  });
}
