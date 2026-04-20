const SENT_PLAY_DATA = []

const SEED_PLAYERS = [
    { userId: "usr_ava", username: "Ava", baseScore: 96 },
    { userId: "usr_noah", username: "Noah", baseScore: 92 },
    { userId: "usr_mia", username: "Mia", baseScore: 89 },
    { userId: "usr_liam", username: "Liam", baseScore: 86 },
    { userId: "usr_emma", username: "Emma", baseScore: 83 },
    { userId: "usr_jack", username: "Jack", baseScore: 80 },
    { userId: "usr_sara", username: "Sara", baseScore: 76 },
    { userId: "usr_luca", username: "Luca", baseScore: 73 },
    { userId: "usr_eoin", username: "Eoin", baseScore: 70 },
    { userId: "usr_nina", username: "Nina", baseScore: 67 }
]

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

    return clampScore(baseScore - mistakePenalty - timePenalty)
}

function toMinimalGameEntry(playData) {
    const safeData = playData || {}
    const correctGuesses = Math.max(0, Math.min(4, Number(safeData.correctGuesses) || 0))
    const failuresUsed = Math.max(0, Number(safeData.failuresUsed) || 0)
    const playTimeSeconds = Number.isFinite(safeData.playTimeSeconds) ? safeData.playTimeSeconds : 0
    const scorePercent = Number.isFinite(safeData.scorePercent)
        ? clampScore(safeData.scorePercent)
        : calculateScorePercent(correctGuesses, failuresUsed, playTimeSeconds)

    return {
        userId: typeof safeData.userId === "string" ? safeData.userId : "",
        username: typeof safeData.username === "string" ? safeData.username : "",
        gameNumber: Number.isFinite(safeData.gameNumber) ? safeData.gameNumber : null,
        completed: Boolean(safeData.completed),
        isWin: Boolean(safeData.isWin),
        failuresUsed,
        correctGuesses,
        scorePercent,
        firstColour: typeof safeData.firstColour === "string" ? safeData.firstColour : null,
        playTimeSeconds,
        receivedAt: Date.now()
    }
}

function createSeedLeaderboardEntries() {
    const now = Date.now()
    const entries = []
    const gameCount = 20

    for (let gameOffset = 0; gameOffset < gameCount; gameOffset++) {
        const gameNumber = 500 + gameOffset

        SEED_PLAYERS.forEach((player, playerIndex) => {
            const variation = ((gameOffset + playerIndex * 2) % 9) - 4
            const scorePercent = clampScore(player.baseScore + variation)

            let correctGuesses = 4
            if (scorePercent < 80) correctGuesses = 3
            if (scorePercent < 60) correctGuesses = 2
            if (scorePercent < 40) correctGuesses = 1

            let failuresUsed = 0
            if (scorePercent < 92) failuresUsed = 1
            if (scorePercent < 75) failuresUsed = 2
            if (scorePercent < 55) failuresUsed = 3

            if (failuresUsed >= 4) {
                correctGuesses = 0
            }

            const playTimeSeconds = 40 + Math.max(0, (100 - scorePercent)) * 2

            entries.push({
                userId: player.userId,
                username: player.username,
                gameNumber,
                completed: true,
                isWin: failuresUsed < 4,
                failuresUsed,
                correctGuesses,
                scorePercent,
                firstColour: ["green", "lime", "lilac", "orange"][(gameOffset + playerIndex) % 4],
                playTimeSeconds,
                receivedAt: now - ((gameCount - gameOffset) * 86400000) - (playerIndex * 60000)
            })
        })
    }

    return entries
}

const SEED_LEADERBOARD_ENTRIES = createSeedLeaderboardEntries()

window.fakeRankingsApi = {
    async sendCurrentGameData(playData) {
        SENT_PLAY_DATA.push(toMinimalGameEntry(playData))

        return {
            success: true,
            queuedCount: SENT_PLAY_DATA.length
        }
    },

    async getLeaderboardData() {
        return {
            entries: [...SEED_LEADERBOARD_ENTRIES, ...SENT_PLAY_DATA]
        }
    }
}
