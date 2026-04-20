const DATE_OF_FIRST_PUZZLE = new Date(2025, 1, 1)
const ALLOW_MOBILE_SHARE = true; 
window.DEBUG_MODE = false; // Controls if data is reset on load and the number of allowed failures
const USE_DUMMY_STATS_DATA = false; // Toggle true to validate stats UI with deterministic test data
const ACTIVE_DUMMY_STATS_SET = 'setA'; // setA | setB

const DUMMY_STATS_CUMULATIVE_SETS = Object.freeze({
    setA: Object.freeze([
        { gameNumber: 394, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 45 },
        { gameNumber: 395, completed: true, isWin: true, failuresUsed: 1, firstColour: 'lime', playTimeSeconds: 63 },
        { gameNumber: 396, completed: true, isWin: true, failuresUsed: 2, firstColour: 'lilac', playTimeSeconds: 81 },
        { gameNumber: 397, completed: true, isWin: true, failuresUsed: 0, firstColour: 'orange', playTimeSeconds: 99 },
        { gameNumber: 398, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 117 },
        { gameNumber: 399, completed: true, isWin: true, failuresUsed: 2, firstColour: 'lime', playTimeSeconds: 135 },
        { gameNumber: 400, completed: true, isWin: true, failuresUsed: 0, firstColour: 'lilac', playTimeSeconds: 153 },
        { gameNumber: 401, completed: true, isWin: true, failuresUsed: 1, firstColour: 'orange', playTimeSeconds: 171 },
        { gameNumber: 402, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 189 },
        { gameNumber: 403, completed: true, isWin: true, failuresUsed: 0, firstColour: 'lime', playTimeSeconds: 45 },
        { gameNumber: 404, completed: true, isWin: true, failuresUsed: 1, firstColour: 'lilac', playTimeSeconds: 63 },
        { gameNumber: 405, completed: true, isWin: true, failuresUsed: 2, firstColour: 'orange', playTimeSeconds: 81 },
        { gameNumber: 406, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 99 },
        { gameNumber: 407, completed: true, isWin: true, failuresUsed: 1, firstColour: 'lime', playTimeSeconds: 117 },
        { gameNumber: 408, completed: true, isWin: true, failuresUsed: 2, firstColour: 'lilac', playTimeSeconds: 135 },
        { gameNumber: 409, completed: true, isWin: true, failuresUsed: 0, firstColour: 'orange', playTimeSeconds: 153 },
        { gameNumber: 410, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 171 },
        { gameNumber: 411, completed: true, isWin: true, failuresUsed: 2, firstColour: 'lime', playTimeSeconds: 189 },
        { gameNumber: 412, completed: true, isWin: true, failuresUsed: 0, firstColour: 'lilac', playTimeSeconds: 45 },
        { gameNumber: 413, completed: true, isWin: true, failuresUsed: 1, firstColour: 'orange', playTimeSeconds: 63 },
        { gameNumber: 414, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 81 },
        { gameNumber: 415, completed: true, isWin: true, failuresUsed: 0, firstColour: 'lime', playTimeSeconds: 99 },
        { gameNumber: 416, completed: true, isWin: true, failuresUsed: 1, firstColour: 'lilac', playTimeSeconds: 117 },
        { gameNumber: 417, completed: true, isWin: true, failuresUsed: 2, firstColour: 'orange', playTimeSeconds: 135 },
        { gameNumber: 418, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 153 },
        { gameNumber: 419, completed: true, isWin: true, failuresUsed: 1, firstColour: 'lime', playTimeSeconds: 171 },
        { gameNumber: 420, completed: true, isWin: true, failuresUsed: 2, firstColour: 'lilac', playTimeSeconds: 189 },
        { gameNumber: 421, completed: true, isWin: true, failuresUsed: 0, firstColour: 'orange', playTimeSeconds: 45 },
        { gameNumber: 422, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 63 },
        { gameNumber: 423, completed: false, isWin: false, failuresUsed: 3, firstColour: null, playTimeSeconds: 11 }
    ]),
    setB: Object.freeze([
        { gameNumber: 500, completed: true, isWin: true, failuresUsed: 0, firstColour: 'orange', playTimeSeconds: 61 },
        { gameNumber: 501, completed: true, isWin: true, failuresUsed: 1, firstColour: 'lilac', playTimeSeconds: 72 },
        { gameNumber: 502, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 93 },
        { gameNumber: 503, completed: true, isWin: true, failuresUsed: 2, firstColour: 'lime', playTimeSeconds: 88 },
        { gameNumber: 504, completed: true, isWin: true, failuresUsed: 0, firstColour: 'orange', playTimeSeconds: 79 },
        { gameNumber: 505, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 95 },
        { gameNumber: 506, completed: true, isWin: true, failuresUsed: 1, firstColour: 'lilac', playTimeSeconds: 69 },
        { gameNumber: 507, completed: true, isWin: true, failuresUsed: 2, firstColour: 'lime', playTimeSeconds: 84 },
        { gameNumber: 508, completed: true, isWin: true, failuresUsed: 0, firstColour: 'orange', playTimeSeconds: 73 },
        { gameNumber: 509, completed: true, isWin: false, failuresUsed: 4, firstColour: 'green', playTimeSeconds: 101 },
        { gameNumber: 510, completed: true, isWin: true, failuresUsed: 1, firstColour: 'lilac', playTimeSeconds: 67 },
        { gameNumber: 511, completed: false, isWin: false, failuresUsed: 2, firstColour: null, playTimeSeconds: 14 }
    ])
});

if (window.DEBUG_MODE) {
    localStorage.removeItem('pick-4-game-data');
    localStorage.removeItem('pick-4-cumulative-data');
    // Add other keys if needed
}

const alertContainer = document.querySelector("[data-alert-container]")
const statsAlertContainer = document.querySelector("[data-stats-alert-container]")
const shareButton = document.querySelector("[data-share-button]")
const playButton = document.querySelector("[data-play-button]")
const yesNoPopupElement = document.querySelector("[data-yes-no-popup]")
const yesNoPopupTextElement = document.querySelector("[data-yes-no-popup-text]")
const yesNoPopupYesButton = document.querySelector("[data-yes-no-popup-yes]")
const yesNoPopupNoButton = document.querySelector("[data-yes-no-popup-no]")
const namePopupElement = document.querySelector("[data-name-popup]")
const namePopupInput = document.querySelector("[data-name-popup-input]")
const namePopupSubmitButton = document.querySelector("[data-name-popup-submit]")

let canInteract = false;
let pendingYesCallback = null
let pendingNoCallback = null
let pendingNameSubmitCallback = null

const LEADERBOARD_NAME_MAX_LENGTH = 15
const USER_ID_LENGTH = 15

let cumulativeProfile = {
    userId: "",
    username: "",
    hasSetUsername: false
}

window.dataLayer = window.dataLayer || [];

const DICTIONARY = "resources/Dictionary.csv";
let puzzles = [];

let targetGameNumber = 0;
let targetPuzzleIndex = 0;

function createDummyCumulativeData() {
    const fixture = DUMMY_STATS_CUMULATIVE_SETS[ACTIVE_DUMMY_STATS_SET] || DUMMY_STATS_CUMULATIVE_SETS.setA;
    return fixture.map(entry => ({ ...entry }));
}

function getStatsDataSource() {
    return USE_DUMMY_STATS_DATA ? createDummyCumulativeData() : cumulativeData;
}

function generateUserId(length = USER_ID_LENGTH) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
    const randomValues = new Uint8Array(length)
    crypto.getRandomValues(randomValues)

    let id = ""
    for (let i = 0; i < randomValues.length; i++) {
        id += alphabet[randomValues[i] % alphabet.length]
    }

    return id
}

function normalizeLeaderboardName(name) {
    if (typeof name !== "string") return ""
    return name.trim().slice(0, LEADERBOARD_NAME_MAX_LENGTH)
}

function ensureCumulativeProfile() {
    const hasValidUserId = typeof cumulativeProfile.userId === "string"
        && cumulativeProfile.userId.trim().length === USER_ID_LENGTH

    if (!hasValidUserId) {
        cumulativeProfile.userId = generateUserId(USER_ID_LENGTH)
    }

    if (typeof cumulativeProfile.hasSetUsername !== "boolean") {
        cumulativeProfile.hasSetUsername = false
    }

    const normalizedUsername = normalizeLeaderboardName(cumulativeProfile.username)
    cumulativeProfile.username = normalizedUsername || cumulativeProfile.userId
}

function clampScore(value) {
    return Math.max(0, Math.min(100, Math.round(value)))
}

function getCorrectGuessBaseScore(correctGuesses) {
    const guessCount = Math.max(0, Math.min(4, Number(correctGuesses) || 0))
    const baseMap = [0, 30, 60, 80, 100]
    return baseMap[guessCount]
}

function getMistakePenalty(mistakesUsed) {
    const mistakes = Math.max(0, Number(mistakesUsed) || 0)
    if (mistakes <= 0) return 0
    if (mistakes === 1) return 10
    if (mistakes === 2) return 22
    if (mistakes === 3) return 36
    return 999
}

function getTimePenalty(playTimeSeconds) {
    const seconds = Math.max(0, Number(playTimeSeconds) || 0)

    if (seconds <= 30) return 0
    if (seconds <= 59) return 3
    if (seconds <= 90) return 6
    if (seconds <= 120) return 9
    if (seconds <= 180) return 12
    if (seconds <= 240) return 15
    if (seconds <= 300) return 18
    return 20
}

function calculateScorePercent(correctGuesses, mistakesUsed, playTimeSeconds) {
    const guesses = Math.max(0, Math.min(4, Number(correctGuesses) || 0))
    const mistakes = Math.max(0, Number(mistakesUsed) || 0)

    if (mistakes >= 4) return 0
    if (mistakes >= 4 && guesses === 0) return 0

    const baseScore = getCorrectGuessBaseScore(guesses)
    const mistakePenalty = getMistakePenalty(mistakes)
    const timePenalty = getTimePenalty(playTimeSeconds)

    const score = baseScore - mistakePenalty - timePenalty
    return clampScore(score)
}

const GAME_BAR_COLOUR_VALUES = Object.freeze({
    green: '#009982',
    lime: '#D2DB5D',
    lilac: '#B8A4CF',
    orange: '#EF806C'
});

function normalizeColourName(colour) {
    if (typeof colour !== 'string') return null;

    const normalizedColour = colour.trim().toLowerCase();
    if (normalizedColour === 'purple') return 'lilac';

    return Object.prototype.hasOwnProperty.call(GAME_BAR_COLOUR_VALUES, normalizedColour)
        ? normalizedColour
        : null;
}

function getPuzzleCategoryConfig(category, puzzleIndex = targetPuzzleIndex) {
    if (typeof category !== 'string') return null;

    const puzzle = puzzles[puzzleIndex];
    if (!puzzle) return null;

    return puzzle[category] || null;
}

function resolveCategoryColour(category, fallbackColour = null, puzzleIndex = targetPuzzleIndex) {
    const categoryConfig = getPuzzleCategoryConfig(category, puzzleIndex);

    return normalizeColourName(categoryConfig?.colour)
        || normalizeColourName(fallbackColour)
        || 'green';
}

function getGameBarColourValue(colour) {
    const normalizedColour = normalizeColourName(colour);
    return GAME_BAR_COLOUR_VALUES[normalizedColour || 'green'];
}

function normalizeGameStateItems(items, puzzleIndex = targetPuzzleIndex) {
    if (!Array.isArray(items)) {
        return getPuzzleItems(puzzleIndex);
    }

    return items.map(item => {
        const safeItem = item || {};
        const category = typeof safeItem.category === 'string' ? safeItem.category : '';

        return {
            ...safeItem,
            text: typeof safeItem.text === 'string' ? safeItem.text : '',
            category,
            colour: resolveCategoryColour(category, safeItem.colour, puzzleIndex),
            submitted: Boolean(safeItem.submitted),
            completed: Boolean(safeItem.completed)
        };
    });
}

window.resolveCategoryColour = resolveCategoryColour;
window.getGameBarColourValue = getGameBarColourValue;

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++; // skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

async function fetchDictionary() {
    const response = await fetch(DICTIONARY);
    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    const puzzlesMap = {};
    lines.slice(1).forEach(line => { // skip header
        const parts = parseCSVLine(line);
        const puzzle = parseInt(parts[0]);
        const colour = parts[2].toLowerCase() === 'purple' ? 'lilac' : parts[2].toLowerCase();
        const category = parts[3].toLowerCase().replace(/ /g, '_');
        const words = parts.slice(4, 8).filter(w => w.trim()); // words 4 to 7
        if (!puzzlesMap[puzzle]) puzzlesMap[puzzle] = {};
        puzzlesMap[puzzle][category] = { colour, words };
    });
    puzzles = Object.values(puzzlesMap);
    // Calculate the number of days since the first puzzle
    const today = new Date();
    const daysSinceFirstPuzzle = Math.floor((today - DATE_OF_FIRST_PUZZLE) / (1000 * 60 * 60 * 24));
    // Use modulo to determine the target game number
    targetGameNumber = daysSinceFirstPuzzle;
    targetPuzzleIndex = targetGameNumber % puzzles.length;
    fetchCumulativeData();
    fetchGameState();
}

fetchDictionary()

function getPuzzleItems(puzzleIndex) {
    const puzzle = puzzles[puzzleIndex];
    if (!puzzle) return;

    const items = [];

    for (const category in puzzle) {
        puzzle[category].words.forEach(text => {
            items.push({
                text,
                category,
                colour: resolveCategoryColour(category, puzzle[category].colour, puzzleIndex),
                submitted: false,
                completed: false
            });
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

function hideNamePopup() {
    if (!namePopupElement) return

    namePopupElement.classList.add("hidden")
    pendingNameSubmitCallback = null
}

function isLeaderboardNameValid(name) {
    if (typeof name !== "string") return false

    const trimmedName = name.trim()

    if (trimmedName.length === 0 || trimmedName.length > LEADERBOARD_NAME_MAX_LENGTH) {
        return false
    }

    return true
}

function sanitizeLeaderboardNameInput(rawName) {
    if (typeof rawName !== "string") return ""

    return rawName.slice(0, LEADERBOARD_NAME_MAX_LENGTH)
}

function updateNamePopupSubmitState() {
    if (!namePopupInput || !namePopupSubmitButton) return false

    const isValidName = isLeaderboardNameValid(namePopupInput.value)
    namePopupSubmitButton.disabled = !isValidName
    namePopupSubmitButton.classList.toggle("enabled", isValidName)

    return isValidName
}

function showNamePopup(onSubmitName) {
    if (!namePopupElement || !namePopupInput || !namePopupSubmitButton) return

    pendingNameSubmitCallback = typeof onSubmitName === "function" ? onSubmitName : null
    namePopupInput.value = ""
    updateNamePopupSubmitState()
    namePopupElement.classList.remove("hidden")
    namePopupInput.focus()
}

function hideYesNoPopup() {
    if (!yesNoPopupElement) return

    yesNoPopupElement.classList.add("hidden")
    pendingYesCallback = null
    pendingNoCallback = null
}

function showYesNoPopup(topText, onYes, onNo = null) {
    if (!yesNoPopupElement || !yesNoPopupTextElement) return

    hideNamePopup()

    const safeTopText = typeof topText === "string" && topText.trim() !== ""
        ? topText
        : "Are you sure?"

    yesNoPopupTextElement.textContent = safeTopText
    pendingYesCallback = typeof onYes === "function" ? onYes : null
    pendingNoCallback = typeof onNo === "function" ? onNo : null
    yesNoPopupElement.classList.remove("hidden")
}

function executeWithYesNoPopup(topText, executable, onNoCallback = null) {
    showYesNoPopup(topText, executable, onNoCallback)
}

window.showYesNoPopup = showYesNoPopup
window.executeWithYesNoPopup = executeWithYesNoPopup

if (namePopupInput) {
    namePopupInput.addEventListener("input", () => {
        const sanitizedValue = sanitizeLeaderboardNameInput(namePopupInput.value)

        if (namePopupInput.value !== sanitizedValue) {
            namePopupInput.value = sanitizedValue
        }

        updateNamePopupSubmitState()
    })
}

if (namePopupSubmitButton) {
    namePopupSubmitButton.addEventListener("click", () => {
        if (!namePopupInput) return

        const enteredName = namePopupInput.value.trim()
        if (!isLeaderboardNameValid(enteredName)) {
            updateNamePopupSubmitState()
            return
        }

        const submitCallback = pendingNameSubmitCallback
        hideNamePopup()

        if (typeof submitCallback === "function") {
            submitCallback(enteredName)
        }
    })
}

if (yesNoPopupYesButton) {
    yesNoPopupYesButton.addEventListener("click", () => {
        const callback = pendingYesCallback
        hideYesNoPopup()

        if (typeof callback === "function") {
            callback()
        }
    })
}

if (yesNoPopupNoButton) {
    yesNoPopupNoButton.addEventListener("click", () => {
        const callback = pendingNoCallback
        hideYesNoPopup()

        if (typeof callback === "function") {
            callback()
        }
    })
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

    if (oldPage === "game" && pageId !== "game" && typeof pausePlayTimeSession === "function") {
        pausePlayTimeSession()
    }

    const pages = document.querySelectorAll('.page')
    pages.forEach(page => {
        page.classList.remove('active')
    })

    document.getElementById(pageId).classList.add('active')
    if (pageId === "game") {
        startupGameLogic();
        if (typeof startPlayTimeSession === "function") startPlayTimeSession()
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
    ensureCumulativeProfile()
    const normalizedUsername = normalizeLeaderboardName(gameState.username)
    gameState.username = normalizedUsername || cumulativeProfile.username
    cumulativeProfile.username = gameState.username

    localStorage.setItem("pick-4-game-data", JSON.stringify(gameState))

    let currentPlayTimeSeconds = 0
    if (typeof getCurrentPlayTimeSeconds === "function") {
        currentPlayTimeSeconds = getCurrentPlayTimeSeconds()
    }

    const correctGuesses = Math.max(0, Math.min(4, Number(gameState.submittedCount) || 0))
    const failuresUsed = Math.max(0, 4 - (Number(gameState.remainingFailures) || 0))
    const scorePercent = calculateScorePercent(correctGuesses, failuresUsed, currentPlayTimeSeconds)

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
            failuresUsed,
            correctGuesses,
            scorePercent,
            firstColour: gameState.firstColour,
            playTimeSeconds: currentPlayTimeSeconds,
            userId: cumulativeProfile.userId,
            username: cumulativeProfile.username
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
            cumulativeData[matchingIndex].failuresUsed = failuresUsed
            cumulativeData[matchingIndex].correctGuesses = correctGuesses
            cumulativeData[matchingIndex].scorePercent = scorePercent
            cumulativeData[matchingIndex].firstColour = gameState.firstColour
            cumulativeData[matchingIndex].playTimeSeconds = currentPlayTimeSeconds
            cumulativeData[matchingIndex].userId = cumulativeProfile.userId
            cumulativeData[matchingIndex].username = cumulativeProfile.username
        }
    }
    storeCumulativeData()
}

function storeCumulativeData() {
    ensureCumulativeProfile()
    localStorage.setItem("pick-4-cumulative-data", JSON.stringify({
        entries: cumulativeData,
        profile: cumulativeProfile
    }))
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

    if (buttonId !== "rankings") {
        hideYesNoPopup()
        hideNamePopup()
        return
    }

    if (!cumulativeProfile.hasSetUsername) {
        hideYesNoPopup()
        showNamePopup((enteredName) => {
            const normalizedName = normalizeLeaderboardName(enteredName)
            if (!isLeaderboardNameValid(normalizedName)) return

            cumulativeProfile.username = normalizedName
            cumulativeProfile.hasSetUsername = true
            gameState.username = normalizedName

            storeCumulativeData()
            storeGameStateData()
            updateRankingsFromApi()
        })
        return
    }

    hideYesNoPopup()
    hideNamePopup()
    updateRankingsFromApi()
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

    gameState.items = normalizeGameStateItems(gameState.items)

    ensureCumulativeProfile()
    gameState.username = cumulativeProfile.username
    storeGameStateData()

    if (typeof ensurePlayTimeState === "function") ensurePlayTimeState()

    if (gameState.hasOpenedPuzzle === true) {
        showPage("welcome")
    } else {
        showPage('info')
    }
}

function fetchCumulativeData() {
    if (USE_DUMMY_STATS_DATA) {
        cumulativeData = createDummyCumulativeData();
        ensureCumulativeProfile()
        storeCumulativeData()
        console.log("Cumulative Data was set to dummy test data")
        return;
    }

    const localStoreJSON = localStorage.getItem("pick-4-cumulative-data")
    if (localStoreJSON != null) {
        console.log("Cumulative Data was Found: " + localStoreJSON)
        const parsedStore = JSON.parse(localStoreJSON)

        if (Array.isArray(parsedStore)) {
            cumulativeData = parsedStore
            cumulativeProfile = {
                userId: "",
                username: "",
                hasSetUsername: false
            }
        } else {
            cumulativeData = Array.isArray(parsedStore.entries) ? parsedStore.entries : []
            cumulativeProfile = {
                userId: typeof parsedStore.profile?.userId === "string" ? parsedStore.profile.userId : "",
                username: typeof parsedStore.profile?.username === "string" ? parsedStore.profile.username : "",
                hasSetUsername: Boolean(parsedStore.profile?.hasSetUsername)
            }
        }

        ensureCumulativeProfile()
        storeCumulativeData()
    } else {
        console.log("Cumulative Data was reset")
        resetCumulativeData()
    }
}

function resetCumulativeData(clearProfile = false) {
    cumulativeData = []

    if (clearProfile) {
        cumulativeProfile = {
            userId: "",
            username: "",
            hasSetUsername: false
        }
    }

    ensureCumulativeProfile()
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

async function updatePerformanceFromApi() {
    if (!window.fakeRankingsApi) return

    const performanceMessageElement = document.querySelector('[data-performance-message]')
    if (!performanceMessageElement) return

    try {
        const leaderboardData = await window.fakeRankingsApi.getLeaderboardData()
        const allEntries = normalizeLeaderboardEntries(leaderboardData?.entries)
        const playerName = normalizeLeaderboardName(cumulativeProfile.username) || cumulativeProfile.userId
        const leaderboardView = buildLeaderboardView(allEntries, playerName, cumulativeProfile.userId)
        const performanceSummary = leaderboardView.performanceSummary
        if (!performanceSummary) return

        performanceMessageElement.innerHTML = "You ranked in the top " + performanceSummary.topPercentToday + "% of players today - <br> well done! Your average rank <br> over the last 30 days has been " + performanceSummary.averageRank30Days + "%."
    } catch (error) {
        console.error("Failed to fetch performance summary", error)
    }
}

function normalizeLeaderboardEntries(entries) {
    if (!Array.isArray(entries)) return []

    return entries
        .map(entry => {
            const safeEntry = entry || {}
            const failuresUsed = Math.max(0, Number(safeEntry.failuresUsed) || 0)
            const correctGuesses = Math.max(0, Math.min(4, Number(safeEntry.correctGuesses) || 0))
            const playTimeSeconds = Math.max(0, Number(safeEntry.playTimeSeconds) || 0)

            return {
                userId: typeof safeEntry.userId === "string" ? safeEntry.userId : "",
                username: typeof safeEntry.username === "string" ? safeEntry.username : "",
                gameNumber: Number.isFinite(safeEntry.gameNumber) ? safeEntry.gameNumber : null,
                completed: Boolean(safeEntry.completed),
                isWin: Boolean(safeEntry.isWin),
                failuresUsed,
                correctGuesses,
                scorePercent: Number.isFinite(safeEntry.scorePercent)
                    ? clampScore(safeEntry.scorePercent)
                    : calculateScorePercent(correctGuesses, failuresUsed, playTimeSeconds),
                firstColour: typeof safeEntry.firstColour === "string" ? safeEntry.firstColour : null,
                playTimeSeconds,
                receivedAtMs: Number.isFinite(safeEntry.receivedAt)
                    ? safeEntry.receivedAt
                    : Date.parse(safeEntry.receivedAt || "") || Date.now()
            }
        })
        .filter(entry => entry.gameNumber !== null && entry.completed)
}

function getLeaderboardIdentity(entry) {
    if (entry.userId && entry.userId.trim() !== "") return "id:" + entry.userId.trim()
    return "name:" + (entry.username || "unknown")
}

function sameUtcDay(leftMs, rightMs) {
    const left = new Date(leftMs)
    const right = new Date(rightMs)

    return left.getUTCFullYear() === right.getUTCFullYear()
        && left.getUTCMonth() === right.getUTCMonth()
        && left.getUTCDate() === right.getUTCDate()
}

function buildLeaderboardView(entries, playerName, playerUserId) {
    const byPlayer = new Map()

    entries.forEach(entry => {
        const key = getLeaderboardIdentity(entry)
        if (!byPlayer.has(key)) byPlayer.set(key, [])
        byPlayer.get(key).push(entry)
    })

    const playerSummaries = Array.from(byPlayer.entries()).map(([key, plays]) => {
        plays.sort((a, b) => b.receivedAtMs - a.receivedAtMs)
        const last20Plays = plays.slice(0, 20)
        const averageScore = last20Plays.length === 0
            ? 0
            : last20Plays.reduce((sum, play) => sum + play.scorePercent, 0) / last20Plays.length

        const averageTime = last20Plays.length === 0
            ? Number.MAX_SAFE_INTEGER
            : last20Plays.reduce((sum, play) => sum + play.playTimeSeconds, 0) / last20Plays.length

        const wins = plays.filter(play => play.isWin).length
        const latestPlay = plays[0]

        return {
            key,
            userId: latestPlay.userId,
            name: latestPlay.username || latestPlay.userId || "Player",
            averageScore,
            averageTime,
            wins,
            plays,
            last20ScoresAscending: last20Plays
                .slice()
                .reverse()
                .map(play => play.scorePercent)
        }
    })

    playerSummaries.sort((a, b) => {
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore
        if (b.wins !== a.wins) return b.wins - a.wins
        return a.averageTime - b.averageTime
    })

    const rankedPlayers = playerSummaries.map((summary, index) => ({
        rank: index + 1,
        name: summary.name,
        percent: clampScore(summary.averageScore),
        userId: summary.userId,
        key: summary.key,
        last20ScoresAscending: summary.last20ScoresAscending,
        plays: summary.plays
    }))

    const playerKey = playerUserId && playerUserId.trim() !== ""
        ? "id:" + playerUserId.trim()
        : "name:" + playerName

    const playerRow = rankedPlayers.find(player => player.key === playerKey)
        || rankedPlayers.find(player => player.name === playerName)
        || null

    const totalPlayers = rankedPlayers.length
    const now = Date.now()
    const myTodayPlays = playerRow
        ? playerRow.plays.filter(play => sameUtcDay(play.receivedAtMs, now))
        : []

    const bestTodayScore = myTodayPlays.length
        ? Math.max(...myTodayPlays.map(play => play.scorePercent))
        : (playerRow ? playerRow.percent : 0)

    const topPercentToday = totalPlayers > 0 && playerRow
        ? Math.max(1, Math.ceil((playerRow.rank / totalPlayers) * 100))
        : 100

    const averageRank30Days = playerRow && playerRow.last20ScoresAscending.length > 0
        ? clampScore(playerRow.last20ScoresAscending.reduce((sum, value) => sum + value, 0) / playerRow.last20ScoresAscending.length)
        : 0

    return {
        topSix: rankedPlayers.slice(0, 6),
        currentRank: playerRow
            ? {
                rank: playerRow.rank,
                totalPlayers,
                percent: playerRow.percent,
                name: playerRow.name
            }
            : {
                rank: totalPlayers,
                totalPlayers,
                percent: 0,
                name: playerName
            },
        playerLast20Plays: playerRow ? playerRow.last20ScoresAscending : [],
        performanceSummary: {
            topPercentToday,
            averageRank30Days: averageRank30Days || bestTodayScore
        }
    }
}

function renderPercentileGraph(percentiles) {
    const chart = document.querySelector('[data-percentile-chart]')
    if (!chart) return

    const values = Array.isArray(percentiles) ? percentiles.slice(0, 20) : []
    if (values.length === 0) {
        chart.innerHTML = ''
        return
    }

    const chartWidth = 320
    const chartHeight = 120
    const pointRadius = 1
    const stepX = values.length > 1 ? chartWidth / (values.length - 1) : chartWidth
    const guideTopY = chartHeight * 0.24
    const guideBottomY = chartHeight * 0.906666
    const plotHeight = guideBottomY - guideTopY

    const points = values.map((value, index) => {
        const safeValue = Math.max(0, Math.min(100, value))
        const x = index * stepX
        const y = guideBottomY - ((safeValue / 100) * plotHeight)
        return { x, y }
    })

    const polylinePoints = points.map(point => point.x.toFixed(2) + ',' + point.y.toFixed(2)).join(' ')
    const circles = points.map(point =>
        '<circle cx="' + point.x.toFixed(2) + '" cy="' + point.y.toFixed(2) + '" r="' + pointRadius + '" fill="var(--evergreen-accent)"></circle>'
    ).join('')

    chart.innerHTML =
        '<polyline points="' + polylinePoints + '" fill="none" stroke="var(--evergreen-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>' +
        circles
}

async function updateRankingsFromApi() {
    if (!window.fakeRankingsApi) return

    const rankMessageElement = document.querySelector('[data-rank-message]')
    const rankingRows = document.querySelectorAll('.overlay[data-overlay-rankings] .stats-cumulative-entry')

    if (rankingRows.length === 0) return

    try {
        const playerName = normalizeLeaderboardName(cumulativeProfile.username) || cumulativeProfile.userId
        const leaderboardData = await window.fakeRankingsApi.getLeaderboardData()
        const allEntries = normalizeLeaderboardEntries(leaderboardData?.entries)
        const { topSix, currentRank, playerLast20Plays } = buildLeaderboardView(allEntries, playerName, cumulativeProfile.userId)

        if (rankMessageElement && currentRank) {
            rankMessageElement.textContent = "You rank #" + currentRank.rank + " out of " + currentRank.totalPlayers + " players"
        }

        renderPercentileGraph(playerLast20Plays)

        rankingRows.forEach((row, index) => {
            const entry = topSix[index]
            const numberElement = row.querySelector('.stats-cumulative-number')
            const nameElement = row.querySelector('.stats-cumulative-name')
            const percentElement = row.querySelector('.stats-cumulative-percent')

            if (!entry) {
                if (numberElement) numberElement.textContent = "-"
                if (nameElement) nameElement.textContent = "-"
                if (percentElement) percentElement.textContent = "-"
                return
            }

            if (numberElement) numberElement.textContent = entry.rank
            if (nameElement) nameElement.textContent = entry.name
            if (percentElement) percentElement.textContent = entry.percent + "%"
        })
    } catch (error) {
        console.error("Failed to fetch rankings data", error)
    }
}

async function sendCurrentSessionPlayDataToApi() {
    if (!window.fakeRankingsApi || typeof window.fakeRankingsApi.sendCurrentGameData !== "function") return

    const currentPlayTimeSeconds = typeof getCurrentPlayTimeSeconds === "function" ? getCurrentPlayTimeSeconds() : 0
    const currentEntry = cumulativeData.find(entry => entry.gameNumber === gameState.gameNumber)
    const correctGuesses = Math.max(0, Math.min(4, Number(gameState.submittedCount) || 0))
    const failuresUsed = Math.max(0, 4 - (Number(gameState.remainingFailures) || 0))
    const scorePercent = calculateScorePercent(correctGuesses, failuresUsed, currentPlayTimeSeconds)

    const payload = {
        ...(currentEntry || {}),
        gameNumber: gameState.gameNumber,
        completed: gameState.isComplete,
        isWin: gameState.isWin,
        failuresUsed,
        correctGuesses,
        scorePercent,
        firstColour: gameState.firstColour,
        playTimeSeconds: currentPlayTimeSeconds,
        userId: cumulativeProfile.userId,
        username: cumulativeProfile.username,
        hasSetUsername: cumulativeProfile.hasSetUsername
    }

    try {
        await window.fakeRankingsApi.sendCurrentGameData(payload)
    } catch (error) {
        console.error("Failed to send play data", error)
    }
}

document.addEventListener("onCompletion", () => {
    sendCurrentSessionPlayDataToApi()
})

function updateAllStats() {
    updatePerformanceFromApi()
    updateRankingsFromApi()

    const statsSource = getStatsDataSource();
    if (!statsSource || statsSource.length === 0) return;

    // Sort by gameNumber
    let sorted = [...statsSource].sort((a, b) => a.gameNumber - b.gameNumber);
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

    function getEmojiForColor(color) {
        switch(color) {
            case 'green': return '🟩';
            case 'lime': return '🟨';
            case 'lilac': return '🟪';
            case 'orange': return '🟧';
            default: return '⬜';
        }
    }

    let textToCopy = "Links\nPuzzle #" + (targetGameNumber + 1) + "\n";
    for (let attempt of gameState.attempts) {
        textToCopy += attempt.colors.map(getEmojiForColor).join('') + "\n";
    }

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

function clearPuzzleData() {
    executeWithYesNoPopup(
        "Are you sure that you wish to clear your Links puzzle data?",
        () => {
            gameState.username = ""
            resetCumulativeData(true)
            resetGameState()
            if (typeof resetGameLogic === 'function') resetGameLogic()
            hideNamePopup()
            pressStatsButton('performance')
            showPage('info', 'stats')
            fireEvent("clearedPuzzleData")
        }
    )
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

window.addEventListener("beforeunload", () => {
    if (typeof pausePlayTimeSession === "function") {
        pausePlayTimeSession()
    }
})