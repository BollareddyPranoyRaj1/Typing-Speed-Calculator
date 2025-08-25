const sampleTexts = [
    "Type this text as fast as you can without mistakes!",
    "Practice makes perfect. Keep typing and improve your speed.",
    "JavaScript is fun! Try typing this as quickly as possible."
];

const sampleTextEl = document.getElementById('sample-text');
const inputField = document.getElementById('input-field');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart');

let startTime;
let timerInterval;
let totalMistakes = 0;
let totalCharsTyped = 0;

function getRandomText() {
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
}

function startTest() {
    inputField.value = '';
    inputField.disabled = false;
    totalMistakes = 0;
    totalCharsTyped = 0;
    startTime = null;
    timerEl.innerText = 'Time: 0s';
    wpmEl.innerText = 'WPM: 0';
    accuracyEl.innerText = 'Accuracy: 100%';
    sampleTextEl.innerHTML = getRandomText();
    inputField.classList.remove('correct', 'incorrect');
}

function updateTimer() {
    const seconds = Math.floor((new Date() - startTime) / 1000);
    timerEl.innerText = `Time: ${seconds}s`;
}

function calculateWPM() {
    const words = inputField.value.trim().split(/\s+/).length;
    const minutes = (new Date() - startTime) / 1000 / 60;
    return (words / minutes) || 0;
}

function calculateAccuracy() {
    return totalCharsTyped === 0 ? 100 : Math.max(0, ((totalCharsTyped - totalMistakes) / totalCharsTyped) * 100);
}

inputField.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
    }

    const typed = inputField.value;
    const sample = sampleTextEl.innerText;

    totalCharsTyped = typed.length;
    totalMistakes = 0;

    for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== sample[i]) {
            totalMistakes++;
        }
    }

    if (typed === sample) {
        clearInterval(timerInterval);
        inputField.disabled = true;
        inputField.classList.add('correct');
    } else {
        inputField.classList.remove('correct');
        inputField.classList.toggle('incorrect', totalMistakes > 0);
    }

    wpmEl.innerText = `WPM: ${calculateWPM().toFixed(2)}`;
    accuracyEl.innerText = `Accuracy: ${calculateAccuracy().toFixed(2)}%`;
});

restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    startTest();
});

// Initialize test on page load
startTest();