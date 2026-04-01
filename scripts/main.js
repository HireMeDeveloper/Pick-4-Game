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

let canInteract = false;

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
    localStorage.setItem("pick-4-game-data", JSON.stringify(gameState))

    let currentPlayTimeSeconds = 0
    if (typeof getCurrentPlayTimeSeconds === "function") {
        currentPlayTimeSeconds = getCurrentPlayTimeSeconds()
    }

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
            firstColour: gameState.firstColour,
            playTimeSeconds: currentPlayTimeSeconds
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
            cumulativeData[matchingIndex].playTimeSeconds = currentPlayTimeSeconds
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

    gameState.items = normalizeGameStateItems(gameState.items)

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
        console.log("Cumulative Data was set to dummy test data")
        return;
    }

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

async function updatePerformanceFromApi() {
    if (!window.fakeRankingsApi) return

    const performanceMessageElement = document.querySelector('[data-performance-message]')
    if (!performanceMessageElement) return

    try {
        const performanceSummary = await window.fakeRankingsApi.getPerformanceSummary()
        if (!performanceSummary) return

        performanceMessageElement.innerHTML = "You ranked in the top " + performanceSummary.topPercentToday + "% of players today - <br> well done! Your average rank <br> over the last 30 days has been " + performanceSummary.averageRank30Days + "%."
    } catch (error) {
        console.error("Failed to fetch performance summary", error)
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
        const playerName = "Jeff"
        const [topSix, currentRank, last20Plays] = await Promise.all([
            window.fakeRankingsApi.getTop6(cumulativeData, playerName),
            window.fakeRankingsApi.getPlayerCurrentRank(cumulativeData, playerName),
            window.fakeRankingsApi.getPlayerLast20Plays(cumulativeData, playerName)
        ])

        if (rankMessageElement && currentRank) {
            rankMessageElement.textContent = "You rank #" + currentRank.rank + " out of " + currentRank.totalPlayers + " players"
        }

        renderPercentileGraph(last20Plays)

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