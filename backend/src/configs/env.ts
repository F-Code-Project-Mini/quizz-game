import dotenv from "dotenv";
import path from "path";
const env = process.env.NODE_ENV || "development";

dotenv.config({
    path: path.resolve(process.cwd(), `.env.${env}`),
});

console.log(`Loaded environment: ${env}`);
