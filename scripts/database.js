// Reference-only mock entries for separate player and game-entry data sets, and sample tables
const PLAYER_ENTRIES_JSON_REFERENCE = `[
    {
        "userId": "usr_1001",
        "playerName": "Jeff",
        "createdAt": "2026-02-10T15:22:11Z",
        "currentRank": 12
    },
    etc...
]`

const PLAYER_GAME_ENTRIES_JSON_REFERENCE = `[
    {
        "entryId": "pge_90001",
        "userId": "usr_1001",
        "gameNumber": 429,
        "completed": true,
        "isWin": true,
        "failuresUsed": 1,
        "correctGuesses": 4,
        "scorePercent": 85,
        "firstColour": "orange",
        "playTimeSeconds": 102,
        "receivedAt": "2026-03-16T18:01:04Z"
    },
    etc...
]`

const PLAYER_ENTRIES_TABLE_REFERENCE = `
userId   | playerName | createdAt            | currentRank
usr_1001 | Jeff       | 2026-02-10T15:22:11Z | 12
usr_1002 | Ava        | 2026-01-12T10:11:00Z | 1
usr_1003 | Noah       | 2026-01-20T08:42:50Z | 2
usr_1004 | Mia        | 2026-01-28T13:03:19Z | 3
usr_1005 | Liam       | 2026-02-02T19:27:41Z | 4
`.trim()

const PLAYER_GAME_ENTRIES_TABLE_REFERENCE = `
entryId   | userId   | gameNumber | completed | isWin | failuresUsed | correctGuesses | scorePercent | firstColour | playTimeSeconds | receivedAt
pge_90001 | usr_1001 | 429        | true      | true  | 1            | 4              | 85           | orange      | 102             | 2026-03-16T18:01:04Z
pge_90002 | usr_1001 | 430        | true      | false | 4            | 0              | 0            | green       | 148             | 2026-03-17T18:03:11Z
pge_90003 | usr_1001 | 431        | true      | true  | 2            | 4              | 63           | lilac       | 114             | 2026-03-18T18:00:04Z
pge_90004 | usr_1002 | 431        | true      | true  | 0            | 4              | 94           | orange      | 63              | 2026-03-18T17:58:00Z
pge_90005 | usr_1003 | 431        | true      | true  | 1            | 4              | 87           | lime        | 77              | 2026-03-18T17:58:44Z
`.trim()

// Reference-only SQL queries for data needed by scripts/api.js.
const SQL_GET_TOP_6_REFERENCE = `
WITH totals AS (
    SELECT COUNT(*)::int AS total_players
    FROM players
)
SELECT
    p.current_rank AS rank,
    p.player_name AS name,
    CASE
        WHEN t.total_players <= 1 THEN 100
        ELSE ROUND(100.0 * (1 - (p.current_rank - 1)::numeric / (t.total_players - 1)))::int
    END AS percent
FROM players p
CROSS JOIN totals t
ORDER BY p.current_rank
LIMIT 6;
`.trim()

const SQL_GET_PLAYER_CURRENT_RANK_REFERENCE = `
WITH totals AS (
    SELECT COUNT(*)::int AS total_players
    FROM players
)
SELECT
    p.current_rank AS rank,
    t.total_players AS totalPlayers,
    CASE
        WHEN t.total_players <= 1 THEN 100
        ELSE ROUND(100.0 * (1 - (p.current_rank - 1)::numeric / (t.total_players - 1)))::int
    END AS percent,
    p.player_name AS name
FROM players p
CROSS JOIN totals t
WHERE p.user_id = :user_id;
`.trim()

const SQL_GET_PLAYER_LAST_20_PLAYS_REFERENCE = `
WITH ranked_games AS (
    SELECT
        pge.game_number,
        pge.user_id,
        pge.received_at,
        RANK() OVER (
            PARTITION BY pge.game_number
            ORDER BY
                CASE WHEN pge.is_win THEN 1 ELSE 0 END DESC,
                pge.failures_used ASC,
                pge.play_time_seconds ASC,
                pge.received_at ASC
        ) AS rank_in_game,
        COUNT(*) OVER (PARTITION BY pge.game_number) AS total_players_in_game
    FROM player_game_entries pge
    WHERE pge.completed = TRUE
),
my_last_20 AS (
    SELECT
        rg.game_number,
        rg.received_at,
        CASE
            WHEN rg.total_players_in_game <= 1 THEN 100
            ELSE ROUND(
                100.0 * (1 - (rg.rank_in_game - 1)::numeric / (rg.total_players_in_game - 1))
            )::int
        END AS percentile
    FROM ranked_games rg
    WHERE rg.user_id = :user_id
    ORDER BY rg.received_at DESC
    LIMIT 20
)
SELECT percentile
FROM my_last_20
ORDER BY received_at ASC;
`.trim()

const SQL_GET_PERFORMANCE_SUMMARY_REFERENCE = `
WITH ranked_games AS (
    SELECT
        pge.game_number,
        pge.user_id,
        pge.received_at,
        RANK() OVER (
            PARTITION BY pge.game_number
            ORDER BY
                CASE WHEN pge.is_win THEN 1 ELSE 0 END DESC,
                pge.failures_used ASC,
                pge.play_time_seconds ASC,
                pge.received_at ASC
        ) AS rank_in_game,
        COUNT(*) OVER (PARTITION BY pge.game_number) AS total_players_in_game
    FROM player_game_entries pge
    WHERE pge.completed = TRUE
),
mine AS (
    SELECT
        rg.received_at,
        rg.rank_in_game,
        CEIL(100.0 * rg.rank_in_game / NULLIF(rg.total_players_in_game, 0))::int AS top_percent
    FROM ranked_games rg
    WHERE rg.user_id = :user_id
)
SELECT
    COALESCE(
        MIN(top_percent) FILTER (WHERE mine.received_at::date = CURRENT_DATE),
        100
    ) AS "topPercentToday",
    COALESCE(
        ROUND(AVG(rank_in_game) FILTER (WHERE mine.received_at >= NOW() - INTERVAL '30 days'))::int,
        0
    ) AS "averageRank30Days"
FROM mine;
`.trim()

const SQL_INSERT_PLAYER_GAME_ENTRY_REFERENCE = `
INSERT INTO player_game_entries (
    entry_id,
    user_id,
    game_number,
    completed,
    is_win,
    failures_used,
    correct_guesses,
    score_percent,
    first_colour,
    play_time_seconds,
    received_at
) VALUES (
    :entry_id,
    :user_id,
    :game_number,
    :completed,
    :is_win,
    :failures_used,
    :correct_guesses,
    :score_percent,
    :first_colour,
    :play_time_seconds,
    NOW()
);

SELECT TRUE AS success, COUNT(*)::int AS queuedCount
FROM player_game_entries
WHERE user_id = :user_id;
`.trim()