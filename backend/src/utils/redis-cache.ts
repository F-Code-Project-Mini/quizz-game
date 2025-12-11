import redisClient from "~/configs/redis";

/**
 * Redis Cache Strategy:
 *
 * CACHE (Fast, Temporary Data):
 * - Game state (current question index, timestamps) - Changes frequently during game
 * - Player answers for current question - Only during active question
 * - Live leaderboard scores - Real-time ranking
 *
 * DO NOT CACHE (Use Database):
 * - Room details (name, code, creator) - Rarely changes
 * - Questions and answers - Static data
 * - Player profiles - Static data
 * - Final game results - Permanent storage
 */

interface GameState {
    roomId: string;
    currentQuestionIndex: number;
    startedAt: string;
    questionStartedAt: string;
    isActive: boolean;
    totalQuestions: number;
}

interface PlayerAnswer {
    playerId: string;
    questionId: string;
    answerId: string;
    answeredAt: string;
    score: number;
}

class RedisCache {
    private prefix = "quiz_game";

    private getKey(type: string, id: string): string {
        return `${this.prefix}:${type}:${id}`;
    }

    async setGameState(roomId: string, state: GameState): Promise<void> {
        const key = this.getKey("game_state", roomId);
        await redisClient.set(key, JSON.stringify(state), "EX", 3600);
    }

    async getGameState(roomId: string): Promise<GameState | null> {
        const key = this.getKey("game_state", roomId);
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }

    async deleteGameState(roomId: string): Promise<void> {
        const key = this.getKey("game_state", roomId);
        await redisClient.del(key);
    }

    async setPlayerAnswer(roomId: string, playerId: string, questionId: string, answer: PlayerAnswer): Promise<void> {
        const key = this.getKey(`answers:${roomId}:${questionId}`, playerId);
        await redisClient.set(key, JSON.stringify(answer), "EX", 7200);
    }

    async getPlayerAnswer(roomId: string, playerId: string, questionId: string): Promise<PlayerAnswer | null> {
        const key = this.getKey(`answers:${roomId}:${questionId}`, playerId);
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }

    async getQuestionAnswers(roomId: string, questionId: string): Promise<PlayerAnswer[]> {
        const pattern = this.getKey(`answers:${roomId}:${questionId}`, "*");
        const keys = await redisClient.keys(pattern);
        const answers: PlayerAnswer[] = [];

        for (const key of keys) {
            const data = await redisClient.get(key);
            if (data) {
                answers.push(JSON.parse(data));
            }
        }

        return answers;
    }

    async setPlayerScore(roomId: string, playerId: string, score: number): Promise<void> {
        const key = this.getKey("scores", roomId);
        await redisClient.zadd(key, score, playerId);
        await redisClient.expire(key, 7200);
    }

    async getLeaderboard(roomId: string, limit: number = 10): Promise<Array<{ playerId: string; score: number }>> {
        const key = this.getKey("scores", roomId);
        const results = await redisClient.zrevrange(key, 0, limit - 1, "WITHSCORES");

        const leaderboard: Array<{ playerId: string; score: number }> = [];
        for (let i = 0; i < results.length; i += 2) {
            leaderboard.push({
                playerId: results[i],
                score: parseInt(results[i + 1]),
            });
        }

        return leaderboard;
    }

    async incrementPlayerScore(roomId: string, playerId: string, points: number): Promise<number> {
        const key = this.getKey("scores", roomId);
        return await redisClient.zincrby(key, points, playerId);
    }

    async clearRoomData(roomId: string): Promise<void> {
        const patterns = [
            this.getKey("game_state", roomId),
            this.getKey("scores", roomId),
            this.getKey(`answers:${roomId}`, "*"),
        ];

        for (const pattern of patterns) {
            if (pattern.includes("*")) {
                const keys = await redisClient.keys(pattern);
                if (keys.length > 0) {
                    await redisClient.del(...keys);
                }
            } else {
                await redisClient.del(pattern);
            }
        }
    }
}

export default new RedisCache();
