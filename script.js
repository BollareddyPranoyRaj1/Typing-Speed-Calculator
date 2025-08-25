const baseParagraph = "The quick brown fox jumps over the lazy dog. This is a typing speed test to measure your words per minute and accuracy. Keep typing until the time runs out!";
const sampleTextEl = document.getElementById('sample-text');
const inputField = document.getElementById('input-field');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart');
const startBtn = document.getElementById('start');
const popup = document.getElementById('time-popup');
const timeButtons = document.querySelectorAll('.time-btn');

let totalMistakes = 0;
let totalCharsTyped = 0;
let timeLeft = 60; // seconds
let timerInterval;

function generateParagraph(durationMinutes) {
    let text = "";
    for (let i = 0; i < durationMinutes; i++) {
        text += baseParagraph + "\n\n"; // add paragraph break
    }
    return text.trim();
}

let startTime;

function startTest(durationMinutes) {
    timeLeft = durationMinutes * 60;

    inputField.value = '';
    inputField.disabled = false;
    totalMistakes = 0;
    totalCharsTyped = 0;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
    wpmEl.innerText = 'WPM: 0';
    accuracyEl.innerText = 'Accuracy: 100%';
    sampleTextEl.innerText = generateParagraph(durationMinutes);
    inputField.classList.remove('correct', 'incorrect');

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// Timer and calculations remain same
function updateTimer() {
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        inputField.disabled = true;
        inputField.classList.add('correct');
    }
}

function calculateWPM() {
    const words = inputField.value.trim().split(/\s+/).length;
    const elapsedMinutes = (new Date() - startTime) / 1000 / 60; // convert milliseconds to minutes
    return elapsedMinutes === 0 ? 0 : words / elapsedMinutes;
}

function calculateAccuracy() {
    return totalCharsTyped === 0 ? 100 : Math.max(0, ((totalCharsTyped - totalMistakes) / totalCharsTyped) * 100);
}

inputField.addEventListener('input', () => {
    const typed = inputField.value;
    const sample = sampleTextEl.innerText;

    totalCharsTyped = typed.length;
    totalMistakes = 0;

    for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== sample[i]) totalMistakes++;
    }

    inputField.classList.remove('correct');
    inputField.classList.toggle('incorrect', totalMistakes > 0);

    wpmEl.innerText = `WPM: ${calculateWPM().toFixed(2)}`;
    accuracyEl.innerText = `Accuracy: ${calculateAccuracy().toFixed(2)}%`;
});

restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    inputField.disabled = true;
    sampleTextEl.innerText = "Select duration and click Start Test";
});

startBtn.addEventListener('click', () => {
    popup.classList.remove('hidden'); // Show popup
});

timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const minutes = parseInt(btn.getAttribute('data-min'));
        popup.classList.add('hidden'); // Hide popup
        startTest(minutes);
    });
});

// Initialize page (disable input until start)
inputField.disabled = true;
sampleTextEl.innerText = "Select duration and click Start Test";