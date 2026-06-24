
document.addEventListener('DOMContentLoaded', () => {

  
  // 1. MODULE TAB ROUTING CONFIG
  
  const tabButtons = document.querySelectorAll('.tab-navigation .tab-btn');
  const modules = document.querySelectorAll('.dashboard-container .module-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabButtons.forEach(b => b.classList.remove('active'));
      modules.forEach(m => m.classList.remove('active'));

      e.target.classList.add('active');
      const targetId = e.target.dataset.target;
      document.getElementById(targetId).classList.add('active');
    });
  });


  // 2. COUNTER MODULE LOGIC Engine
  
  let countState = 0;
  
  const displayEl = document.getElementById('counter-display');
  const preventNegativeCheck = document.getElementById('prevent-negative-toggle');
  const incBtn = document.getElementById('counter-increment');
  const decBtn = document.getElementById('counter-decrement');
  const resetCountBtn = document.getElementById('counter-reset');

  function updateCounterUI(animationClass = '') {
    displayEl.textContent = countState;
    
    if (animationClass) {
      displayEl.classList.add(animationClass);
      setTimeout(() => displayEl.classList.remove(animationClass), 150);
    }
  }

  incBtn.addEventListener('click', () => {
    countState++;
    updateCounterUI('scale-flash');
  });

  decBtn.addEventListener('click', () => {
    if (preventNegativeCheck.checked && countState <= 0) {
      updateCounterUI('scale-flash-neg');
      return;
    }
    countState--;
    updateCounterUI('scale-flash-neg');
  });

  resetCountBtn.addEventListener('click', () => {
    countState = 0;
    updateCounterUI();
  });


  
  // 3. STOPWATCH MODULE LOGIC Engine
  
  let swIntervalId = null;
  let startTime = 0;
  let elapsedTime = 0;
  let lapRecords = [];

  const swDisplay = document.getElementById('stopwatch-display');
  const swStartBtn = document.getElementById('sw-start');
  const swPauseBtn = document.getElementById('sw-pause');
  const swResumeBtn = document.getElementById('sw-resume');
  const swLapBtn = document.getElementById('sw-lap');
  const swResetBtn = document.getElementById('sw-reset');
  
  const lapsList = document.getElementById('laps-list');
  const lapsEmptyState = document.getElementById('laps-empty');
  const clearLapsBtn = document.getElementById('clear-laps-btn');

  function formatTime(totalMilliseconds) {
    let hours = Math.floor(totalMilliseconds / 3600000);
    let minutes = Math.floor((totalMilliseconds % 3600000) / 600000); // 10s place optimization
    let secondsTotal = Math.floor((totalMilliseconds % 60000) / 1000);
    let msTotal = Math.floor((totalMilliseconds % 1000) / 10);

    let minutesRaw = Math.floor((totalMilliseconds % 3600000) / 6000);
    let minStr = Math.floor(minutesRaw / 10).toString() + (minutesRaw % 10).toString();
    
    let hrStr = hours.toString().padStart(2, '0');
    let secStr = secondsTotal.toString().padStart(2, '0');
    let msStr = msTotal.toString().padStart(2, '0');

    return `${hrStr}:${minStr}:${secStr}<span class="ms-label">.${msStr}</span>`;
  }

  function renderStopwatch() {
    elapsedTime = Date.now() - startTime;
    swDisplay.innerHTML = formatTime(elapsedTime);
  }

  function setButtonVisibility(state) {
    // states available: 'RESET', 'RUNNING', 'PAUSED'
    if (state === 'RUNNING') {
      swStartBtn.classList.add('hidden');
      swResumeBtn.classList.add('hidden');
      swPauseBtn.classList.remove('hidden');
      swLapBtn.disabled = false;
    } else if (state === 'PAUSED') {
      swPauseBtn.classList.add('hidden');
      swResumeBtn.classList.remove('hidden');
      swLapBtn.disabled = true;
    } else { // 'RESET' fallback state
      swStartBtn.classList.remove('hidden');
      swPauseBtn.classList.add('hidden');
      swResumeBtn.classList.add('hidden');
      swLapBtn.disabled = true;
    }
  }

  swStartBtn.addEventListener('click', () => {
    startTime = Date.now();
    swIntervalId = setInterval(renderStopwatch, 10); // Precise 10ms frame redraw intervals
    setButtonVisibility('RUNNING');
  });

  swPauseBtn.addEventListener('click', () => {
    clearInterval(swIntervalId);
    // Snap elapsed timeline state natively
    elapsedTime = Date.now() - startTime; 
    setButtonVisibility('PAUSED');
  });

  swResumeBtn.addEventListener('click', () => {
    startTime = Date.now() - elapsedTime;
    swIntervalId = setInterval(renderStopwatch, 10);
    setButtonVisibility('RUNNING');
  });

  swResetBtn.addEventListener('click', () => {
    clearInterval(swIntervalId);
    swIntervalId = null;
    elapsedTime = 0;
    swDisplay.innerHTML = `00:00:00<span class="ms-label">.00</span>`;
    setButtonVisibility('RESET');
  });

  // Laps Submodule Mutations
  swLapBtn.addEventListener('click', () => {
    if (!swIntervalId) return;
    
    lapRecords.unshift(elapsedTime); // Push newest split cleanly onto top stack
    renderLapsUI();
  });

  clearLapsBtn.addEventListener('click', () => {
    lapRecords = [];
    renderLapsUI();
  });

  function renderLapsUI() {
    lapsList.innerHTML = '';
    
    if (lapRecords.length === 0) {
      lapsEmptyState.classList.remove('hidden');
      clearLapsBtn.classList.add('hidden');
      return;
    }

    lapsEmptyState.classList.add('hidden');
    clearLapsBtn.classList.remove('hidden');

    const fragment = document.createDocumentFragment();
    
    lapRecords.forEach((lapTime, idx) => {
      const li = document.createElement('li');
      li.className = 'lap-item';
      
      // Calculate true index based on inverse array array mutations
      const displayIndex = lapRecords.length - idx;
      
      li.innerHTML = `
        <span class="lap-index">Lap ${displayIndex}</span>
        <span class="lap-timestamp">${formatTime(lapTime)}</span>
      `;
      fragment.appendChild(li);
    });

    lapsList.appendChild(fragment);
  }

});