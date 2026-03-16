let timerStarted = false

function ensurePlayTimeState() {
    if (typeof gameState.accumulatedPlayTimeMs !== "number") {
        gameState.accumulatedPlayTimeMs = (typeof gameState.playTimeMs === "number") ? gameState.playTimeMs : 0
    }

    if (gameState.activePlayStartedAtMs === undefined) {
        gameState.activePlayStartedAtMs = (gameState.playSessionStartedAt !== undefined) ? gameState.playSessionStartedAt : null
    }

    if (gameState.completedAtMs === undefined) gameState.completedAtMs = null
}

function startPlayTimeSession() {
    ensurePlayTimeState()
    if (gameState.isComplete) return
    if (gameState.activePlayStartedAtMs != null) return

    gameState.activePlayStartedAtMs = Date.now()
    storeGameStateData()
}

function pausePlayTimeSession() {
    ensurePlayTimeState()
    if (gameState.activePlayStartedAtMs == null) return

    const elapsedMs = Date.now() - gameState.activePlayStartedAtMs
    if (elapsedMs > 0) {
        gameState.accumulatedPlayTimeMs += elapsedMs
    }

    gameState.activePlayStartedAtMs = null
    storeGameStateData()
}

function completePlayTimeTracking() {
    ensurePlayTimeState()
    if (gameState.completedAtMs != null) return

    const completedAt = Date.now()
    if (gameState.activePlayStartedAtMs != null) {
        const elapsedMs = completedAt - gameState.activePlayStartedAtMs
        if (elapsedMs > 0) {
            gameState.accumulatedPlayTimeMs += elapsedMs
        }
    }

    gameState.activePlayStartedAtMs = null
    gameState.completedAtMs = completedAt
    storeGameStateData()
}

function getCurrentPlayTimeMs() {
    ensurePlayTimeState()
    if (gameState.activePlayStartedAtMs == null) return gameState.accumulatedPlayTimeMs

    const liveElapsedMs = Date.now() - gameState.activePlayStartedAtMs
    return gameState.accumulatedPlayTimeMs + Math.max(0, liveElapsedMs)
}

function getCurrentPlayTimeSeconds() {
    return Math.floor(getCurrentPlayTimeMs() / 1000)
}

let gameState = {
    gameNumber: 0,
    isComplete: false,
    isWin: false,
    hasOpenedPuzzle: false,
    remainingFailures: 4,
    accumulatedPlayTimeMs: 0,
    activePlayStartedAtMs: null,
    completedAtMs: null,
    items: [
        // Board games
        { text: "Chess", category: "board", submitted: false },
        { text: "Checkers", category: "board", submitted: false },
        { text: "Monopoly", category: "board", submitted: false },
        { text: "Scrabble", category: "board", submitted: false },

        // Card games
        { text: "Poker", category: "card", submitted: false },
        { text: "Blackjack", category: "card", submitted: false },
        { text: "Uno", category: "card", submitted: false },
        { text: "Go Fish", category: "card", submitted: false },

        // Sports games
        { text: "FIFA", category: "sports", submitted: false },
        { text: "NBA 2K", category: "sports", submitted: false },
        { text: "Rocket League", category: "sports", submitted: false },
        { text: "Madden", category: "sports", submitted: false },

        // RPG / Adventure games
        { text: "Skyrim", category: "rpg", submitted: false },
        { text: "Elden Ring", category: "rpg", submitted: false },
        { text: "Zelda", category: "rpg", submitted: false },
        { text: "Baldur’s Gate", category: "rpg", submitted: false }
    ],
    submittedCount: 0, // number of groups already submitted
    incorrectGuesses: []
}

let cumulativeData = []

if (window.DEBUG_MODE) {
    cumulativeData = [];
}

const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500

function resetGameState() {
    gameState = {
        gameNumber: targetGameNumber,
        puzzleNumber: targetPuzzleIndex,
        isComplete: false,
        isWin: false,
        hasOpenedPuzzle: false,
        remainingFailures: DEBUG_MODE ? 1 : 4,
        accumulatedPlayTimeMs: 0,
        activePlayStartedAtMs: null,
        completedAtMs: null,
        items: getPuzzleItems(targetPuzzleIndex),
        submittedCount: 0,
        firstColour: null,
        incorrectGuesses: [],
        consecutiveCorrect: 0,
        attempts: []
    }

    storeGameStateData()
}

function startTimer() {
    
}

function getTimerDuration(wordSize) {
    console.log("Requested a timer from word size: " + wordSize)
    if (wordSize > 9) wordSize = 9;
    return ((30 + (10 * (wordSize - 7))) * 100);
}

function stopTimer() {
    timerStarted = false
}

function pauseTimer() {
    timerStarted = false
}

function unpauseTimer() {
    if (currentTimerTime === 0) return;
    timerStarted = true

    updateTimer(currentTimerTime, currentTimerMax)
}

function updateTimer(totalHundredths, maxTime) {
    if (timerStarted === false) return;

    currentTimerTime = totalHundredths
    currentTimerMax = maxTime

    let seconds = Math.floor(totalHundredths / 100);
    let hundredths = totalHundredths % 100;
    let formattedHundreds = (hundredths < 10) ? ((hundredths === 0) ? '00' : '0' + hundredths) : hundredths
    let formattedTime = `00:${(seconds < 10) ? '0' + seconds : seconds}`;

    drawCircle(totalHundredths / maxTime, formattedTime)

    //let timerText = document.querySelector('.text-timer')
    //timerText.textContent = formattedTime

    if (totalHundredths > 0) {
        setTimeout(() => {
            updateTimer(totalHundredths - 1, maxTime)
        }, 10)
    } else {
        timerEnd()
    }
}

function timerEnd() {
    
}

function updateTimerDisplay(hasWon) {
    
}

function enableTimerDisplay() {
    
}

function loadPuzzleFromState(index) {
    
}

function loadPuzzle(index) {
    
}

function handleKeyPress(e) {
    if (canInteract) {
        if (e.key === "Delete") {
            
            return
        }

        if (e.key === "Backspace") {
            
            return
        }

        if (e.key.match(/^[a-z]$/)) {
            
            return
        } else if (e.key.match(/^[A-Z]$/)) {
            
            return
        }
    } else {
        if (e.key === "Enter") {
            
        }
    }
}

function shakeKeys(keys) {
    const inputKeys = getAllInputKeys()

    keys.forEach((key, i) => {
        key.classList.add("shake")
        key.addEventListener("animationend", () => {
            key.classList.remove("shake")
        }, { once: true })
    });
}