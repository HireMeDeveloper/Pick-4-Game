const DATE_OF_FIRST_PUZZLE = new Date(2024, 6, 25)
const ALLOW_MOBILE_SHARE = true; 

const alertContainer = document.querySelector("[data-alert-container]")
const statsAlertContainer = document.querySelector("[data-stats-alert-container]")
const shareButton = document.querySelector("[data-share-button]")
const playButton = document.querySelector("[data-play-button]")

let canInteract = false;

window.dataLayer = window.dataLayer || [];

const DICTIONARY = "resources/Dictionary.json";
let puzzles = [];

async function fetchDictionary() {
    const response = await fetch(DICTIONARY);
    puzzles = await response.json();

    // Pick and load a random puzzle for now
    const puzzleIndex = Math.floor(Math.random() * puzzles.length);
    loadPuzzleIntoGameState(puzzleIndex);
}

fetchDictionary()

function loadPuzzleIntoGameState(puzzleIndex) {
    const puzzle = puzzles[puzzleIndex];
    if (!puzzle) return;

    const items = [];

    for (const category in puzzle) {
        puzzle[category].forEach(text => {
            items.push({ text, category, submitted: false });
        });
    }

    // Reset gameState
    gameState.currentGame = puzzleIndex;
    gameState.isComplete = false;
    gameState.hasOpenedPuzzle = false;
    gameState.remainingFailures = 4;
    gameState.items = items;
    gameState.submittedCount = 0;
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

    }
    else if (pageId === "welcome") {
        
    }
    else if (pageId === "info") {
        
    }

    if (oldPage != null) lastPage = oldPage
}

function startInteraction() {
    document, addEventListener("keydown", handleKeyPress)

    canInteract = true
}

function stopInteraction() {
    canInteract = false
}

function storeGameStateData() {
    //localStorage.setItem("conundrumGameState", JSON.stringify(gameState))
}

function storeCumulativeData() {
    //localStorage.setItem("conundrumCumulativeData", JSON.stringify(cumulativeData))
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
    const localStateJSON = localStorage.getItem("conundrumGameState")
    let localGameState = null
    if (localStateJSON != null) {
        localGameState = JSON.parse(localStateJSON)

        if (localGameState.gameNumber === (targetGameNumber + 1)) {
            gameState = localGameState
        } else {
            console.log("Game state was reset since puzzle does not match: " + localGameState.gameNumber + " & " + targetGameNumber)
            resetGameState()
        }
    } else {
        console.log("Game state was reset since localStorage did not contain 'conundrumGameState'")
        resetGameState()
    }

    updateCumulativeData()

    if (gameState.hasOpenedPuzzle === true || gameState.games[gameState.currentGame].wasStarted === true) {
        showPage("welcome")
    } else {
        showPage('info')
    }
}

function fetchCumulativeData() {
    const localStoreJSON = localStorage.getItem("conundrumCumulativeData")
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
    
}

function updateInfoPage() {
    
}

function processStats() {
    
}

function updateAllStats() {

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