
// --- DATA STRUCTURE: QUESTION MATRIX ---
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

// --- APPLICATION STATE ---
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;

// --- DOM ELEMENTS REFERENCE HUD ---
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackMessage = document.getElementById('feedback-message');

const questionCounter = document.getElementById('question-counter');
const scoreCounter = document.getElementById('score-counter');
const progressBarFill = document.getElementById('progress-bar-fill');
const quizProgressPanel = document.getElementById('quiz-progress-panel');

const resultScoreText = document.getElementById('result-score-text');
const resultMotivation = document.getElementById('result-motivation');
const resultIcon = document.getElementById('result-icon');

// --- APP CONTROLLER INTERACTION ACTIONS ---

function initQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answerSelected = false;
  
  quizProgressPanel.style.opacity = "0.3";
  showScreen(startScreen);
}

function startQuiz() {
  quizProgressPanel.style.opacity = "1";
  showScreen(questionScreen);
  loadQuestion();
}

function loadQuestion() {
  answerSelected = false;
  feedbackMessage.textContent = '';
  feedbackMessage.className = 'feedback-message';
  nextBtn.classList.add('hidden');
  optionsContainer.innerHTML = '';

  const currentQuestion = quizData[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;
  
  // HUD update metrics
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
  scoreCounter.textContent = `Score: ${score}`;
  
  const progressPercentage = (currentQuestionIndex / quizData.length) * 100;
  progressBarFill.style.width = `${progressPercentage}%`;

  // Loops through answers arrays to construct UI choices dynamically
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.addEventListener('click', () => handleAnswerSelection(index, button));
    optionsContainer.appendChild(button);
  });
}

function handleAnswerSelection(selectedIndex, selectedButton) {
  if (answerSelected) return; // Prevent selection tampering post-lock
  answerSelected = true;

  const currentQuestion = quizData[currentQuestionIndex];
  const choiceButtons = optionsContainer.querySelectorAll('.option-btn');

  // Freeze out options inputs completely
  choiceButtons.forEach(btn => btn.disabled = true);

  // Validate answer index selections using operational conditional structures
  if (selectedIndex === currentQuestion.correct) {
    score++;
    selectedButton.classList.add('correct');
    feedbackMessage.textContent = 'Correct Answer! 🌟';
    feedbackMessage.classList.add('correct-text');
  } else {
    selectedButton.classList.add('incorrect');
    // Highlight the missed actual true answer variant for pedagogical reinforcement
    choiceButtons[currentQuestion.correct].classList.add('correct');
    feedbackMessage.textContent = 'Incorrect Choice.';
    feedbackMessage.classList.add('incorrect-text');
  }

  scoreCounter.textContent = `Score: ${score}`;
  nextBtn.classList.remove('hidden');
}

function handleNextStep() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    evaluateFinalResults();
  }
}

function evaluateFinalResults() {
  progressBarFill.style.width = '100%';
  showScreen(resultScreen);
  
  resultScoreText.textContent = `You scored ${score} out of ${quizData.length}`;
  
  // Performance logic evaluations matching tiering levels
  const performanceRatio = score / quizData.length;
  
  if (performanceRatio === 1) {
    resultIcon.textContent = '👑';
    resultMotivation.textContent = "Absolute perfection! You possess advanced frontend knowledge ready for top-tier challenges.";
  } else if (performanceRatio >= 0.7) {
    resultIcon.textContent = '🏆';
    resultMotivation.textContent = "Great job! Strong structural core awareness. Keep building and tweaking projects.";
  } else if (performanceRatio >= 0.5) {
    resultIcon.textContent = '⚡';
    resultMotivation.textContent = "Decent attempt. Review some core JavaScript definitions and try again to improve your score.";
  } else {
    resultIcon.textContent = '📚';
    resultMotivation.textContent = "Keep practicing. Read documentation on execution context frameworks to build confidence.";
  }
}

// --- CORE UTILITY ROUTERS ---

function showScreen(targetScreen) {
  const screens = [startScreen, questionScreen, resultScreen];
  screens.forEach(screen => screen.classList.remove('active'));
  targetScreen.classList.add('active');
}

// --- EVENT LISTENERS REGISTRATION ---
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', handleNextStep);
restartBtn.addEventListener('click', startQuiz);

// Bootstrap Runtime Application Execution Layer
initQuiz();