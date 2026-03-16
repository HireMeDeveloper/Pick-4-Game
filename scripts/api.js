const TOP_6_DATA = [
    { rank: 1, name: "Ava", percent: 98 },
    { rank: 2, name: "Noah", percent: 95 },
    { rank: 3, name: "Mia", percent: 93 },
    { rank: 4, name: "Liam", percent: 90 },
    { rank: 5, name: "Emma", percent: 88 },
    { rank: 6, name: "Jack", percent: 86 }
]

const CURRENT_PLAYER_RANK = {
    rank: 12,
    totalPlayers: 2103,
    percent: 72,
    name: "Player"
}

const CURRENT_PLAYER_LAST_20_PLAYS = [
    72, 84, 68, 90, 76,
    88, 93, 81, 95, 79,
    86, 91, 74, 97, 83,
    89, 92, 78, 96, 100
]

const PERFORMANCE_SUMMARY = {
    topPercentToday: 10,
    averageRank30Days: 54
}

const SENT_PLAY_DATA = []

function getTop6WithCurrentPlayer() {
    const playerName = CURRENT_PLAYER_RANK.name
    const playerRank = CURRENT_PLAYER_RANK.rank
    const playerPercent = CURRENT_PLAYER_RANK.percent

    const top6 = TOP_6_DATA.slice(0, 6)
    const existingPlayerIndex = top6.findIndex(entry => entry.name === playerName)

    if (playerRank <= 6) {
        if (existingPlayerIndex === -1) {
            top6[playerRank - 1] = {
                rank: playerRank,
                name: playerName,
                percent: playerPercent
            }
        }
        return top6
    }

    const withoutPlayer = top6.filter(entry => entry.name !== playerName)
    const firstFive = withoutPlayer.slice(0, 5)

    firstFive.push({
        rank: playerRank,
        name: playerName,
        percent: playerPercent
    })

    return firstFive
}

window.fakeRankingsApi = {
    async getTop6() {
        return getTop6WithCurrentPlayer()
    },

    async getPlayerCurrentRank() {
        return CURRENT_PLAYER_RANK
    },

    async getPlayerLast20Plays() {
        return CURRENT_PLAYER_LAST_20_PLAYS
    },

    async getPerformanceSummary() {
        return PERFORMANCE_SUMMARY
    },

    async sendCurrentSessionPlayData(playData) {
        SENT_PLAY_DATA.push({
            ...playData,
            receivedAt: Date.now()
        })

        return {
            success: true,
            queuedCount: SENT_PLAY_DATA.length
        }
    }
}
