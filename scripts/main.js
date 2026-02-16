const DATE_OF_FIRST_PUZZLE = new Date(2025, 1, 1)
const ALLOW_MOBILE_SHARE = true; 

const alertContainer = document.querySelector("[data-alert-container]")
const statsAlertContainer = document.querySelector("[data-stats-alert-container]")
const shareButton = document.querySelector("[data-share-button]")
const playButton = document.querySelector("[data-play-button]")

let canInteract = false;

window.dataLayer = window.dataLayer || [];

const DICTIONARY = "resources/Dictionary.json";
let puzzles = [];

let targetGameNumber = 0;
let targetPuzzleIndex = 0;

async function fetchDictionary() {
    const response = await fetch(DICTIONARY);
    puzzles = await response.json();

    // Calculate the number of days since the first puzzle
    const today = new Date();
    const daysSinceFirstPuzzle = Math.floor((today - DATE_OF_FIRST_PUZZLE) / (1000 * 60 * 60 * 24));

    // Use modulo to determine the target game number
    targetGameNumber = daysSinceFirstPuzzle;
    targetPuzzleIndex = targetGameNumber % puzzles.length;

    fetchGameState();
    fetchCumulativeData();
}

fetchDictionary()

function getPuzzleItems(puzzleIndex) {
    const puzzle = puzzles[puzzleIndex];
    if (!puzzle) return;

    const items = [];

    for (const category in puzzle) {
        puzzle[category].words.forEach(text => {
            items.push({ text, category, colour: puzzle[category].colour, submitted: false, completed: false});
        });
    }

    return items;
}

function showAlert(message, isWin = false, duration = 1000) {
    if (duration === null) {
        clearAlerts()
    }

    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    
    if (isWin) alert.classList.add("win")
    else alert.classList.add("loss")
    
    alertContainer.prepend(alert)
    if (duration == null) return

    setTimeout(() => {
        alert.classList.add("hide")
        alert.addEventListener("transitionend", () => {
            alert.remove()
        })
    }, duration)
}

function clearAlerts() {
    const alerts = document.querySelectorAll('.alert')

    alerts.forEach((alert) => {
        alert.remove()
    })
}

function showShareAlert(message, duration = 1000) {
    clearAlerts()

    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")

    statsAlertContainer.append(alert)

    setTimeout(() => {
        alert.classList.add("hide")
        alert.addEventListener("transitionend", () => {
            alert.remove()
        })
    }, duration)
}

function showPage(pageId, oldPage = null) {
    if (oldPage === null) {
        const page = document.querySelector('.page.active')
        if (page != null) {
            oldPage = page.id
        } else {
            oldPage = "game"
        }
    }

    if (pageId != "welcome" && pageId != "game" && pageId != "info" && pageId != "stats") {
        console.log("Invalid page: " + pageId + ". Openning 'game' page.")
        pageId = "game"
    }

    const pages = document.querySelectorAll('.page')
    pages.forEach(page => {
        page.classList.remove('active')
    })

    document.getElementById(pageId).classList.add('active')
    if (pageId === "game") {
        startupGameLogic();
    }
    else if (pageId === "stats") {
        updateAllStats();
    }
    else if (pageId === "welcome") {
        generateWelcomeMessage();
    }
    else if (pageId === "info") {
        
    }

    if (oldPage != null) lastPage = oldPage
}

function continueToGame() {
    fireEvent("continueGame");
    showPage('game');
}

function startInteraction() {
    document.addEventListener("keydown", handleKeyPress)

    canInteract = true
}

function stopInteraction() {
    canInteract = false
}

function storeGameStateData() {
    localStorage.setItem("pick-4-game-data", JSON.stringify(gameState))

    var hasCumulativeDataForPuzzle = false
    cumulativeData.forEach(entry => {
        if (entry.gameNumber === gameState.gameNumber) {
            hasCumulativeDataForPuzzle = true
        }
    })

    if (hasCumulativeDataForPuzzle == false) {
        const newCumulativeEntry = {
            gameNumber: gameState.gameNumber,
            completed: gameState.isComplete,
            isWin: gameState.isWin,
            failuresUsed: 4 - gameState.remainingFailures,
            firstColour: gameState.firstColour
        }
        cumulativeData.push(newCumulativeEntry)
    } else {
        var matchingIndex = -1
        cumulativeData.forEach((entry, index) => {
            if (entry.gameNumber === gameState.gameNumber) {
                matchingIndex = index
            }
        })

        if (matchingIndex != -1) {
            cumulativeData[matchingIndex].completed = gameState.isComplete
            cumulativeData[matchingIndex].isWin = gameState.isWin
            cumulativeData[matchingIndex].failuresUsed = 4 - gameState.remainingFailures
            cumulativeData[matchingIndex].firstColour = gameState.firstColour
        }
    }
    storeCumulativeData()
}

function storeCumulativeData() {
    localStorage.setItem("pick-4-cumulative-data", JSON.stringify(cumulativeData))
}

function pressStatsButton(buttonId) {
    const statsButtons = document.querySelectorAll('[data-stats-button]')
    statsButtons.forEach(button => {
        button.classList.remove('selected')
    })

    const pressedButton = document.querySelector(`[data-${buttonId}]`)
    pressedButton.classList.add('selected')

    const statsOverlays = document.querySelectorAll('[data-stats-overlay]')
    statsOverlays.forEach(overlay => {
        overlay.classList.remove('active')
    })

    const pressedOverlay = document.querySelector(`[data-overlay-${buttonId}]`)
    pressedOverlay.classList.add('active')
}

function fetchGameState() {
    const localStateJSON = localStorage.getItem("pick-4-game-data")
    let localGameState = null
    if (localStateJSON != null) {
        localGameState = JSON.parse(localStateJSON)

        if (localGameState.gameNumber == targetGameNumber) {
            gameState = localGameState
        } else {
            console.log("Game state was reset since puzzle does not match: " + localGameState.gameNumber + " & " + targetGameNumber)
            resetGameState()
        }
    } else {
        console.log("Game state was reset since localStorage did not contain 'pick-4-game-data'")
        resetGameState()
    }

    if (gameState.hasOpenedPuzzle === true) {
        showPage("welcome")
    } else {
        showPage('info')
    }
}

function fetchCumulativeData() {
    const localStoreJSON = localStorage.getItem("pick-4-cumulative-data")
    if (localStoreJSON != null) {
        console.log("Cumulative Data was Found: " + localStoreJSON)
        cumulativeData = JSON.parse(localStoreJSON)
        storeCumulativeData()
    } else {
        console.log("Cumulative Data was reset")
        resetCumulativeData()
    }
}

function resetCumulativeData() {
    cumulativeData = []
    storeCumulativeData()
}

function generateWelcomeMessage() {
    let welcomeMessageElement = document.querySelector('[data-welcome-message]')

    if (gameState.isComplete) {
        welcomeMessageElement.textContent = "Tomorrow is another day, \nand another puzzle. See you then."
    } else {
        welcomeMessageElement.innerHTML = "So far today, you have " + gameState.submittedCount + " successful <br> groups of words linked. <br>How far can you get by midnight?"
    }
}

function updateInfoPage() {
    
}

function processStats() {
    
}

function updateAllStats() {
    if (!cumulativeData || cumulativeData.length === 0) return;

    // Sort by gameNumber
    let sorted = cumulativeData.sort((a, b) => a.gameNumber - b.gameNumber);
    let completed = sorted.filter(e => e.completed).length;

    let totalGames = sorted.length;
    let wins = sorted.filter(e => e.isWin).length;
    let winPercent = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    // Current Streak
    let currentStreak = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
        if (sorted[i].isWin) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Max Streak
    let maxStreak = 0;
    let temp = 0;
    for (let entry of sorted) {
        if (entry.isWin) {
            temp++;
            if (temp > maxStreak) maxStreak = temp;
        } else {
            temp = 0;
        }
    }

    // Perfect Puzzles: wins with 0 failures
    let perfect = sorted.filter(e => e.isWin && e.failuresUsed === 0).length;

    // Orange Firsts: completed with firstColour orange
    let orangeFirsts = sorted.filter(e => e.completed && e.firstColour === 'orange').length;

    // Update HTML
    let statsData = document.querySelectorAll('.stats-grid .statistic-data');
    if (statsData.length >= 6) {
        statsData[0].textContent = completed;
        statsData[1].textContent = winPercent + '%';
        statsData[2].textContent = currentStreak;
        statsData[3].textContent = maxStreak;
        statsData[4].textContent = perfect;
        statsData[5].textContent = orangeFirsts;
    }
}

function updateStats(statsGrid, daysPlayed, games, wins, hintsUsed, grade) {
    
}

function pressShare() {
    if (gameState.isComplete == false) {
        showShareAlert("Complete todays puzzle to share!")
        return;
    }

    let textToCopy = "TEST"

    if (navigator.share && detectTouchscreen() && ALLOW_MOBILE_SHARE) {
        navigator.share({
            text: textToCopy
        })
    } else {
        navigator.clipboard.writeText(textToCopy)
        showShareAlert("Link Copied! Share with Your Friends!")
    }

    fireEvent("pressedShare");
}

function detectTouchscreen() {
    var result = false
    if (window.PointerEvent && ('maxTouchPoints' in navigator)) {
        if (navigator.maxTouchPoints > 0) {
            result = true
        }
    } else {
        if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
            result = true
        } else if (window.TouchEvent || ('ontouchstart' in window)) {
            result = true
        }
    }
    return result
}

function fireEvent(eventName) {
    const event = new CustomEvent(eventName)

    document.dispatchEvent(event)
    pushEventToDataLayer(event)

    console.log("EVENT: " + eventName)
}

function pushEventToDataLayer(event) {
    const eventName = event.type
    const eventDetails = event.detail

    window.dataLayer.push({
        'event': eventName,
        ...eventDetails
    })

    console.log(window.dataLayer)
}