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

const completionPopup = document.getElementById('completion-popup');
const startAgainBtn = document.getElementById('start-again');
const container = document.querySelector('.container');

let totalMistakes = 0;
let totalCharsTyped = 0;
let timeLeft = 60;
let timerInterval;
let startTime;

// Generate paragraph(s)
function generateParagraph(minutes) {
    let text = "";
    for (let i = 0; i < minutes; i++) {
        text += baseParagraph + "\n\n";
    }
    return text.trim();
}
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
        const cursorPosition = inputField.selectionStart;
        if (cursorPosition > 0) {
            // If the character before the cursor is a space, prevent backspace
            if (inputField.value[cursorPosition - 1] === ' ') {
                e.preventDefault();
            }
        }
    }
});

// Start test
function startTest(minutes) {
    startTime = new Date();
    timeLeft = minutes * 60;
    inputField.value = '';
    inputField.disabled = false;
    totalMistakes = 0;
    totalCharsTyped = 0;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
    wpmEl.innerText = 'WPM: 0';
    accuracyEl.innerText = 'Accuracy: 100%';
    sampleTextEl.innerText = generateParagraph(minutes);
    inputField.classList.remove('correct', 'incorrect');

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// Timer countdown
function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        inputField.disabled = true;

        // Update completion popup results circles
        document.getElementById('final-wpm-circle').innerText = `WPM: ${calculateWPM().toFixed(2)}`;
        document.getElementById('final-accuracy-circle').innerText = `Accuracy: ${calculateAccuracy().toFixed(2)}%`;

        // Show completion popup and blur background
        completionPopup.classList.add('show');
        container.classList.add('blur-background');

        return;
    }
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;
}

// Calculate WPM
function calculateWPM() {
    const words = inputField.value.trim().split(/\s+/).filter(w => w).length;
    const minutesElapsed = (new Date() - startTime) / 1000 / 60;
    return minutesElapsed > 0 ? words / minutesElapsed : 0;
}

// Calculate accuracy
function calculateAccuracy() {
    return totalCharsTyped === 0 ? 100 : Math.max(0, ((totalCharsTyped - totalMistakes) / totalCharsTyped) * 100);
}

// Typing input listener
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

// Start test popup open and blur background
startBtn.addEventListener('click', () => {
    popup.classList.remove('hidden');
    container.classList.add('blur-background'); // Add blur on start test popup
});

// (Remove the duplicate second listener on startBtn)

// Time selection buttons in popup
timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.min);
        popup.classList.add('hidden');
        container.classList.remove('blur-background'); // Remove blur once test starts
        startTest(minutes);
    });
});

// Start Again button in completion popup
startAgainBtn.addEventListener('click', () => {
    completionPopup.classList.remove('show');
    container.classList.remove('blur-background');
    resetTest();
});

// Restart button event listener here
restartBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    resetTest();
    container.classList.remove('blur-background');
    popup.classList.add('hidden');
    completionPopup.classList.remove('show');
});


// Reset test state and UI
function resetTest() {
    inputField.value = '';
    inputField.disabled = true;
    sampleTextEl.innerText = "Select duration and click Start Test";
    wpmEl.innerText = 'WPM: 0';
    accuracyEl.innerText = 'Accuracy: 100%';
    timerEl.innerText = 'Time Elapsed: 0s';

    totalMistakes = 0;
    totalCharsTyped = 0;

    // Safety: Hide completion popup if still visible
    completionPopup.classList.remove('show');
}

// Initialize state on page load
inputField.disabled = true;
sampleTextEl.innerText = "Select duration and click Start Test";