// Game state variables
let homeScore = 0;
let awayScore = 0;
let homeGoals = [];
let awayGoals = [];
let currentQuarter = 1;
let selections = {};  // Player selections or other data
let elapsedPausedTime = 0;
let isTimerPaused = true;
let startTime = Date.now();
let saveTimeout;

// Function to save the game state to local storage
function saveToLocalStorage() {
    try {
        localStorage.setItem('homeScore', homeScore.toString());
        localStorage.setItem('awayScore', awayScore.toString());
        localStorage.setItem('homeGoals', JSON.stringify(homeGoals));
        localStorage.setItem('awayGoals', JSON.stringify(awayGoals));
        localStorage.setItem('currentQuarter', currentQuarter.toString());
        localStorage.setItem('selections', JSON.stringify(selections));
        localStorage.setItem('elapsedPausedTime', elapsedPausedTime.toString());
        localStorage.setItem('isTimerPaused', isTimerPaused.toString());
        localStorage.setItem('startTime', startTime.toString());
    } catch (e) {
        console.error('Failed to save game data to local storage:', e);
    }
}

// Function to load the game state from local storage
function loadFromLocalStorage() {
    try {
        const storedHomeScore = localStorage.getItem('homeScore');
        const storedAwayScore = localStorage.getItem('awayScore');
        const storedHomeGoals = localStorage.getItem('homeGoals');
        const storedAwayGoals = localStorage.getItem('awayGoals');
        const storedCurrentQuarter = localStorage.getItem('currentQuarter');
        const storedSelections = localStorage.getItem('selections');
        const storedElapsedPausedTime = localStorage.getItem('elapsedPausedTime');
        const storedIsTimerPaused = localStorage.getItem('isTimerPaused');
        const storedStartTime = localStorage.getItem('startTime');

        // Restore saved data
        if (storedHomeScore !== null) homeScore = parseInt(storedHomeScore);
        if (storedAwayScore !== null) awayScore = parseInt(storedAwayScore);
        if (storedHomeGoals !== null) homeGoals = JSON.parse(storedHomeGoals);
        if (storedAwayGoals !== null) awayGoals = JSON.parse(storedAwayGoals);
        if (storedCurrentQuarter !== null) currentQuarter = parseInt(storedCurrentQuarter);
        if (storedSelections !== null) selections = JSON.parse(storedSelections);
        if (storedElapsedPausedTime !== null) elapsedPausedTime = parseInt(storedElapsedPausedTime);
        if (storedIsTimerPaused !== null) isTimerPaused = (storedIsTimerPaused === 'true');
        if (storedStartTime !== null) startTime = parseInt(storedStartTime);

        updateUI();  // Restore UI with loaded data
        resumeTimerIfPaused();  // Resume timer if it was running
    } catch (e) {
        console.error('Failed to load game data from local storage:', e);
    }
}

// Function to update the UI with the loaded state
function updateUI() {
    document.getElementById('homeScore').innerText = homeScore;
    document.getElementById('awayScore').innerText = awayScore;
    // Update other UI elements such as goals, quarter, selections, etc.
}

// Function to handle timer resumption
function resumeTimerIfPaused() {
    if (!isTimerPaused) {
        startTimer();  // Continue the timer if it was running
    } else {
        // If the timer was paused, update the UI to show paused state
        updateTimerUI(elapsedPausedTime);
    }
}

// Function to start or resume the timer
function startTimer() {
    // Logic to start or resume the timer using `startTime`, `elapsedPausedTime`, etc.
}

// Function to update the timer UI
function updateTimerUI(time) {
    document.getElementById('timer').innerText = formatTime(time);
}

// Function to format time (e.g., convert milliseconds to minutes and seconds)
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Function to debounce saving to avoid frequent writes to local storage
function debounceSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveToLocalStorage();
    }, 500);  // 500ms debounce
}

// Periodic auto-save mechanism (every 10 seconds)
setInterval(() => {
    saveToLocalStorage();
}, 10000);

// Event listener to auto-save before the page is unloaded (e.g., on refresh)
window.addEventListener('beforeunload', function () {
    saveToLocalStorage();
});

// Load the game state on page load
window.onload = function () {
    loadFromLocalStorage();
};

// Example of user interaction handlers to update scores and state
document.getElementById('incrementHomeScore').addEventListener('click', function () {
    homeScore++;
    document.getElementById('homeScore').innerText = homeScore;
    debounceSave();
});

document.getElementById('incrementAwayScore').addEventListener('click', function () {
    awayScore++;
    document.getElementById('awayScore').innerText = awayScore;
    debounceSave();
});

// Similarly, other event listeners can be added for updating goals, comments, selections, etc.
