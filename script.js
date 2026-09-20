const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsContainer = document.getElementById('laps');

let timerId = null;
let startTime = 0;
let accumulatedTime = 0;
let isRunning = false;

function formatTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const rem = Math.floor(ms % 1000);

  const formattedM = m < 10 ? `0${m}` : m;
  const formattedS = s < 10 ? `0${s}` : s;
  const formattedMs = rem.toString().padStart(3, '0');

  return `${formattedM}:${formattedS}.${formattedMs}`;
}

function tick() {
  const diff = accumulatedTime + (performance.now() - startTime);
  timeDisplay.textContent = formatTime(diff);
  timerId = requestAnimationFrame(tick);
}

function handleStart() {
  if (isRunning) return;

  isRunning = true;
  startTime = performance.now();
  timerId = requestAnimationFrame(tick);

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  lapBtn.disabled = false;
}

function handlePause() {
  if (!isRunning) return;

  isRunning = false;
  cancelAnimationFrame(timerId);
  accumulatedTime += performance.now() - startTime;

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
}

function handleReset() {
  cancelAnimationFrame(timerId);
  isRunning = false;
  accumulatedTime = 0;
  startTime = 0;

  timeDisplay.textContent = '00:00.000';
  lapsContainer.innerHTML = '';

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
}

function handleLap() {
  const currentElapsed = isRunning 
    ? accumulatedTime + (performance.now() - startTime)
    : accumulatedTime;

  const count = lapsContainer.children.length + 1;
  const lapRow = document.createElement('div');
  lapRow.className = 'lap';
  lapRow.innerHTML = `
    <span>Lap ${count}</span>
    <span>${formatTime(currentElapsed)}</span>
  `;

  lapsContainer.prepend(lapRow);
}

startBtn.addEventListener('click', handleStart);
pauseBtn.addEventListener('click', handlePause);
resetBtn.addEventListener('click', handleReset);
lapBtn.addEventListener('click', handleLap);

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    isRunning ? handlePause() : handleStart();
  } else if (e.key.toLowerCase() === 'l' && !lapBtn.disabled) {
    handleLap();
  } else if (e.key.toLowerCase() === 'r') {
    handleReset();
  }
});