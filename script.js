const quizData = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false },
            { text: "Paris", correct: true },
            { text: "Rome", correct: false }
        ]
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Earth", correct: false },
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Venus", correct: false }
        ]
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: [
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
            { text: "Pacific Ocean", correct: true }
        ]
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        answers: [
            { text: "Charles Dickens", correct: false },
            { text: "William Shakespeare", correct: true },
            { text: "Jane Austen", correct: false },
            { text: "Mark Twain", correct: false }
        ]
    },
    {
        question: "What is 2 + 2 * 2?",
        answers: [
            { text: "4", correct: false },
            { text: "6", correct: true }, // Order of operations: 2 * 2 = 4, then 2 + 4 = 6
            { text: "8", correct: false },
            { text: "2", correct: false }
        ]
    }
];

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const progressTextElement = document.getElementById('progress-text');

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const scoreTextElement = document.getElementById('score-text');
const feedbackTextElement = document.getElementById('feedback-text');
const restartButton = document.getElementById('restart-btn');

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions; // To hold shuffled questions for each quiz attempt

function startQuiz() {
    shuffledQuestions = quizData.sort(() => Math.random() - 0.5); // Shuffle questions
    currentQuestionIndex = 0;
    score = 0;
    resultsContainer.style.display = 'none';
    quizContainer.style.display = 'block'; // Or 'flex' if you use flex for centering body items
    nextButton.innerHTML = "Next";
    nextButton.disabled = true; // Disable next until an answer is selected
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    progressTextElement.innerText = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;

    // Shuffle answers for the current question
    const shuffledAnswers = currentQuestion.answers.sort(() => Math.random() - 0.5);

    shuffledAnswers.forEach(answer => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        li.appendChild(button);
        answerButtonsElement.appendChild(li);
    });
}

function resetState() {
    clearStatusClass(document.body); // Or a more specific container if needed
    nextButton.disabled = true;
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";

    Array.from(answerButtonsElement.children).forEach(li => {
        const button = li.querySelector('button');
        setStatusClass(button, button.dataset.correct === "true");
        button.disabled = true; // Disable all buttons after selection
    });

    if (correct) {
        score++;
        selectedButton.classList.add('correct'); // Highlight selected correct
    } else {
        selectedButton.classList.add('incorrect'); // Highlight selected incorrect
    }
    nextButton.disabled = false; // Enable next button

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.innerHTML = "Next";
    } else {
        nextButton.innerHTML = "Show Results";
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('incorrect');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('incorrect');
}

function showResults() {
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block'; // Or 'flex' if you use flex
    scoreTextElement.innerText = `You scored ${score} out of ${shuffledQuestions.length}!`;

    let feedbackMsg = "";
    const percentage = (score / shuffledQuestions.length) * 100;
    if (percentage >= 80) {
        feedbackMsg = "Excellent! You're a quiz master!";
    } else if (percentage >= 50) {
        feedbackMsg = "Good job! You know your stuff.";
    } else {
        feedbackMsg = "Keep practicing! You'll get there.";
    }
    feedbackTextElement.innerText = feedbackMsg;
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

restartButton.addEventListener('click', startQuiz);

// Start the quiz when the page loads
startQuiz();