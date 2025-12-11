import Redis from "ioredis";

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
});

redisClient.on("error", (error) => {
    console.error(`[ioredis] Connect failed: ${error.message}!`);
});

redisClient.on("connect", () => {
    console.log("[ioredis] Connect redis ok!.");
});

export default redisClient;
