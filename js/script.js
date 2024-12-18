const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');
const resultEl = document.getElementById('result');

let currentQuestion;
let correctAnswer;

// Function to fetch a new question
async function fetchQuestion() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error('Error fetching question:', error);
    }
}

// Helper function to decode HTML entities
function decodeHTML(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

// Modified displayQuestion function
function displayQuestion(question) {
    questionEl.textContent = decodeHTML(question.question);
    correctAnswer = decodeHTML(question.correct_answer);
    
    const options = [...question.incorrect_answers, question.correct_answer];
    options.sort(() => Math.random() - 0.5);
    
    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = decodeHTML(option);
        button.addEventListener('click', () => selectOption(button));
        optionsContainer.appendChild(button);
    });
}


// Function to handle option selection
function selectOption(selectedButton) {
    optionsContainer.querySelectorAll('button').forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
}

// Function to check the answer
function checkAnswer() {
    const selectedButton = optionsContainer.querySelector('.selected');
    if (!selectedButton) {
        resultEl.textContent = 'Please select an answer!';
        return;
    }
    
    if (selectedButton.textContent === correctAnswer) {
        resultEl.textContent = 'Correct!';
    } else {
        resultEl.textContent = `Wrong! The correct answer is: ${correctAnswer}`;
    }
    
    submitBtn.disabled = true;
    setTimeout(loadNewQuestion, 3000);
}

// Function to load a new question
async function loadNewQuestion() {
    resultEl.textContent = '';
    submitBtn.disabled = false;
    currentQuestion = await fetchQuestion();
    displayQuestion(currentQuestion);
}

// Event listener for submit button
submitBtn.addEventListener('click', checkAnswer);

// Initial load
loadNewQuestion();
