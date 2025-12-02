import Redis from "ioredis";

const redisClient = new Redis(process.env.URL_REDIS || "redis://127.0.0.1:6379");
redisClient.on("error", (error) => {
    console.error(`[ioredis] Connect failed: ${error.message}!`);
});
redisClient.on("connect", () => {
    console.log("[ioredis] Connect redis ok!.");
});

export default redisClient;
