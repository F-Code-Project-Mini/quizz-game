import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const socket = io(API_URL, {});

socket.on("connect", () => {
    console.log("✅ Socket connected successfully!");
});

socket.on("disconnect", () => {
    console.log("❌ Socket disconnected.");
});
