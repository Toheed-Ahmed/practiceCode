
document.addEventListener('DOMContentLoaded', () => {

  // --- COMPILER QUESTION DATA ARCHITECTURE ---
  const quizData = [
    {
      question: "Which of the following is NOT a primitive data type in JavaScript?",
      options: ["String", "Boolean", "Object", "Undefined"],
      correct: 2
    },
    {
      question: "What is the primary function of the array method '.map()'?",
      options: [
        "Mutates the original array data directly", 
        "Creates a new array populated with results of a calling function", 
        "Filters elements out matching structural criteria", 
        "Checks if at least one item satisfies a conditional check"
      ],
      correct: 1
    },
    {
      question: "Which HTML5 element is structurally used to wrap tangential, peripheral sidebar content?",
      options: ["<section>", "<aside>", "<article>", "<nav>"],
      correct: 1
    },
    {
      question: "In CSS Flexbox, which property controls alignment along the main axis?",
      options: ["align-items", "align-content", "justify-content", "flex-direction"],
      correct: 2
    },
    {
      question: "What is the behavioral output of evaluated expression: typeof null?",
      options: ["'null'", "'undefined'", "'string'", "'object'"],
      correct: 3
    },
    {
      question: "Which keyword permits declaring variables scoped exclusively to the enclosing block in ES6?",
      options: ["var", "let", "global", "constant"],
      correct: 1
    },
    {
      question: "What mechanism allows an inner function access to outer enclosing scope scopes even after execution completes?",
      options: ["Hoisting", "Closures", "Prototypes", "Shadowing"],
      correct: 1
    },
    {
      question: "Which HTTP status code represents a resource modification request that successfully authenticated but was forbidden by permissions?",
      options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
      correct: 2
    },
    {
      question: "How do you prevent a form submission event from forcing a complete browser webpage reload?",
      options: ["event.stopImmediatePropagation()", "event.preventDefault()", "return false;", "event.stopPropagation()"],
      correct: 1
    },
    {
      question: "Which mechanism allows you to execute operations asynchronously without blocking the primary thread execution stack?",
      options: ["Promises & Async/Await", "For...of Loops", "JSON Serialization", "Math.random Evaluations"],
      correct: 0
    }
  ];

  // --- APP SYSTEM STATES ---
  let phaseIndex = 0;
  let metricsScore = 0;
  let phaseLocked = false;

  // --- DOM NODES INTERACTION HUD ---
  const startScreen = document.getElementById('start-screen');
  const questionScreen = document.getElementById('question-screen');
  const resultScreen = document.getElementById('result-screen');
  
  const startBtn = document.getElementById('start-btn');
  const nextBtn = document.getElementById('next-btn');
  const restartBtn = document.getElementById('restart-btn');
  
  const hudMetricsPanel = document.getElementById('hud-metrics');
  const hudCounter = document.getElementById('hud-counter');
  const hudScore = document.getElementById('hud-score');
  const systemProgressBar = document.getElementById('quiz-progress');
  
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  
  const feedbackTray = document.getElementById('feedback-tray');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackMessage = document.getElementById('feedback-message');
  const ariaAnnouncer = document.getElementById('aria-announcer');

  const resultScoreText = document.getElementById('result-score-text');
  const resultMotivation = document.getElementById('result-motivation');
  const resultIcon = document.getElementById('result-icon');

  // --- PROTOCOL CONTROLLER LOOPS ---

  function initAppEngine() {
    phaseIndex = 0;
    metricsScore = 0;
    phaseLocked = false;
    
    hudMetricsPanel.classList.add('hidden');
    systemProgressBar.value = 0;
    routeViewportDisplay(startScreen);
  }

  function launchEvaluation() {
    hudMetricsPanel.classList.remove('hidden');
    routeViewportDisplay(questionScreen);
    compileActivePhase();
  }

  function compileActivePhase() {
    phaseLocked = false;
    feedbackTray.classList.remove('revealed', 'correct-state', 'incorrect-state');
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = '';

    const currentData = quizData[phaseIndex];
    questionText.textContent = currentData.question;
    
    // Refresh Global HUD Elements
    const localizedIndexStr = (phaseIndex + 1).toString().padStart(2, '0');
    const totalLengthStr = quizData.length.toString().padStart(2, '0');
    hudCounter.textContent = `${localizedIndexStr}/${totalLengthStr}`;
    hudScore.textContent = metricsScore.toString().padStart(3, '0');
    
    const progressTimelineRatio = (phaseIndex / quizData.length) * 100;
    systemProgressBar.value = progressTimelineRatio;

    // Build Form Radio Selection Nodes securely
    const documentFragment = document.createDocumentFragment();
    
    currentData.options.forEach((optionText, idx) => {
      const optionWrapper = document.createElement('div');
      optionWrapper.className = 'choice-item-wrapper';
      
      const uniqueInputId = `opt-${phaseIndex}-${idx}`;
      
      optionWrapper.innerHTML = `
        <input type="radio" name="quiz-choice" id="${uniqueInputId}" value="${idx}" class="choice-radio-input">
        <label for="${uniqueInputId}" class="choice-control-plate">
          <span>${escapeStringHTML(optionText)}</span>
        </label>
      `;
      
      // Bind event listeners to label interaction components safely
      optionWrapper.querySelector('.choice-radio-input').addEventListener('change', (e) => {
        evaluateChoiceSubmission(idx, optionWrapper);
      });
      
      documentFragment.appendChild(optionWrapper);
    });
    
    optionsContainer.appendChild(documentFragment);
    announceToScreenReader(`System phase ${phaseIndex + 1} initialized. ${currentData.question}`);
  }

  function evaluateChoiceSubmission(chosenIndex, targetWrapperElement) {
    if (phaseLocked) return;
    phaseLocked = true;

    const activeQuestion = quizData[phaseIndex];
    const inputsList = optionsContainer.querySelectorAll('.choice-radio-input');
    const wrapperNodes = optionsContainer.querySelectorAll('.choice-item-wrapper');

    // Freeze inputs instantly
    inputsList.forEach(input => input.disabled = true);

    if (chosenIndex === activeQuestion.correct) {
      metricsScore++;
      targetWrapperElement.classList.add('state-correct');
      triggerFeedbackUI(true, 'Verification Complete. Correct Metric Option.');
    } else {
      targetWrapperElement.classList.add('state-incorrect');
      // Highlight exact accurate option tracking values
      wrapperNodes[activeQuestion.correct].classList.add('state-correct');
      triggerFeedbackUI(false, 'Verification Failed. Option Parameter Mismatch.');
    }

    hudScore.textContent = metricsScore.toString().padStart(3, '0');
    nextBtn.classList.remove('hidden');
    nextBtn.focus();
  }

  function triggerFeedbackUI(isAccurate, messageText) {
    feedbackTray.className = `feedback-tray revealed ${isAccurate ? 'correct-state' : 'incorrect-state'}`;
    feedbackIcon.textContent = isAccurate ? '✓' : '✕';
    feedbackMessage.textContent = messageText;
    announceToScreenReader(messageText);
  }

  function progressToNextPhase() {
    phaseIndex++;
    if (phaseIndex < quizData.length) {
      compileActivePhase();
    } else {
      buildEvaluationMetricsSummary();
    }
  }

  function buildEvaluationMetricsSummary() {
    systemProgressBar.value = 100;
    routeViewportDisplay(resultScreen);
    
    const displayTotalStr = quizData.length.toString().padStart(2, '0');
    const displayFinalScoreStr = metricsScore.toString().padStart(2, '0');
    resultScoreText.textContent = `${displayFinalScoreStr} / ${displayTotalStr}`;
    
    const accuracyRatio = metricsScore / quizData.length;
    
    if (accuracyRatio === 1) {
      resultIcon.textContent = '👑';
      resultMotivation.textContent = "Absolute system perfection. Core architecture metrics completely verified for terminal deployment.";
    } else if (accuracyRatio >= 0.7) {
      resultIcon.textContent = '🏆';
      resultMotivation.textContent = "High proficiency parameters observed. Engineering diagnostics indicate strong frontend baseline parameters.";
    } else if (accuracyRatio >= 0.5) {
      resultIcon.textContent = '⚡';
      resultMotivation.textContent = "Nominal system response. Traces of core operational variations found. Codebase parameter synchronization recommended.";
    } else {
      resultIcon.textContent = '📚';
      resultMotivation.textContent = "System out of bounds. Core runtime discrepancies detected. Re-evaluating foundational engine manuals is highly recommended.";
    }
    
    announceToScreenReader(`Evaluation finalized. Your final accuracy metric score is ${metricsScore} out of ${quizData.length}.`);
  }

  // --- CORE SYSTEM DISPATCH ROUTERS ---

  function routeViewportDisplay(activeTargetPanel) {
    const panelsList = [startScreen, questionScreen, resultScreen];
    panelsList.forEach(panel => panel.classList.remove('active'));
    activeTargetPanel.classList.add('active');
  }

  function announceToScreenReader(rawMessage) {
    ariaAnnouncer.textContent = rawMessage;
  }

  function escapeStringHTML(sourceStr) {
    return sourceStr.replace(/[&<>'"]/g, 
      matchedTag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[matchedTag] || matchedTag)
    );
  }

  // --- MOTOR LIFECYCLE LISTENERS ---
  startBtn.addEventListener('click', launchEvaluation);
  nextBtn.addEventListener('click', progressToNextPhase);
  restartBtn.addEventListener('click', initAppEngine);

  // Initialize System Component Core
  initAppEngine();
});