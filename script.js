// Quiz Questions
const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    answer: "Paris"
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Python", "Java", "C++", "JavaScript"],
    answer: "JavaScript"
  },
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"],
    answer: "Cascading Style Sheets"
  },
  {
    question: "HTML stands for?",
    options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Machine Language", "High Text Markup Language"],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Netscape", "Microsoft", "Google", "Oracle"],
    answer: "Netscape"
  }
];

// Shuffle questions and options
questions.sort(() => Math.random() - 0.5);
questions.forEach(q => q.options.sort(() => Math.random() - 0.5));

// DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const timerBar = document.getElementById("timer-bar");
const themeToggle = document.getElementById("theme-toggle");

let currentQuestion = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timer;
let timeLeft = 15;

// Sound effects (place correct.mp3 and wrong.mp3 in project folder)
let correctSound = new Audio('correct.mp3');
let wrongSound = new Audio('wrong.mp3');

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.getElementById('quiz-container').classList.toggle('dark-mode');
});

// Load question
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;

  const q = questions[currentQuestion];
  questionEl.textContent = `Q${currentQuestion + 1}: ${q.question}`;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", selectAnswer);
    optionsEl.appendChild(button);
  });

  updateScore();
  updateProgress();
  startTimer();
}

// Update score display
function updateScore() {
  let highScore = localStorage.getItem('highScore') || 0;
  scoreEl.textContent = `Score: ${score} | Correct: ${correctCount}, Wrong: ${wrongCount} | Time: ${timeLeft}s | High Score: ${highScore}`;
}

// Update progress bar
function updateProgress() {
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
}

// Handle answer selection
function selectAnswer(e) {
  clearInterval(timer);
  const selected = e.target.textContent;
  const correct = questions[currentQuestion].answer;

  if (selected === correct) {
    e.target.style.backgroundColor = "green";
    score++;
    correctCount++;
    correctSound.play();
  } else {
    e.target.style.backgroundColor = "red";
    wrongCount++;
    wrongSound.play();
    // Highlight correct answer
    Array.from(optionsEl.children).forEach(btn => {
      if (btn.textContent === correct) btn.style.backgroundColor = "green";
    });
  }

  // Disable all options
  Array.from(optionsEl.children).forEach(btn => btn.disabled = true);
  updateScore();
}

// Timer function
function startTimer() {
  timerBar.style.width = "100%";
  timer = setInterval(() => {
    timeLeft--;
    timerBar.style.width = `${(timeLeft/15)*100}%`;
    updateScore();
    if(timeLeft < 0) {
      clearInterval(timer);
      wrongCount++;
      currentQuestion++;
      if(currentQuestion < questions.length) loadQuestion();
      else finishQuiz();
    }
  }, 1000);
}

// Next button functionality
nextBtn.addEventListener("click", () => {
  clearInterval(timer);
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
});

// Finish Quiz
function finishQuiz() {
  clearInterval(timer);
  questionEl.textContent = "Quiz Completed!";
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";

  const percentage = Math.round((score / questions.length) * 100);
  let message = "";
  if(percentage >= 80) message = "Excellent!";
  else if(percentage >= 50) message = "Good!";
  else message = "Needs Improvement";

  // Update high score
  let highScore = localStorage.getItem('highScore') || 0;
  if(score > highScore) localStorage.setItem('highScore', score);

  scoreEl.textContent = `Your Score: ${score} / ${questions.length} (${percentage}%) - ${message} | High Score: ${localStorage.getItem('highScore')}`;

  // Restart button
  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart Quiz";
  restartBtn.style.marginTop = "20px";
  restartBtn.style.padding = "10px 20px";
  restartBtn.style.cursor = "pointer";
  restartBtn.addEventListener("click", () => location.reload());
  optionsEl.appendChild(restartBtn);

  progressBar.style.width = "100%";
}

// Load first question initially
loadQuestion();
