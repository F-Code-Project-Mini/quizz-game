import express from "express";
import "dotenv/config"; // thêm cái này để có thể sử dụng biến môi trường (nếu k sẽ là underfined), import ở file này thì tất cả file con đều được áp dụng
import { defaultErrorHandler } from "./middlewares/error.middlewares";
import { defaultSuccessHandler } from "./middlewares/success.middlewares";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./configs/env";
import roomRouter from "./routes/room.routes";
import clubRouter from "./routes/club.routes";
import authRouter from "./routes/auth.routes";
import { createServer } from "http";
import { Server } from "socket.io";
import socketQuizz from "./sockets/quizz.socket";
const app = express();
const PORT = process.env.PORT || 8000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
    },
});

socketQuizz(io);
app.use(express.static("uploads"));
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.CLIENT_URL,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/room", roomRouter);
app.use("/club", clubRouter);

app.use(defaultErrorHandler);
app.use(defaultSuccessHandler);
httpServer.listen(PORT, () => {
    console.log(`Server successfully launched on PORT ${PORT}!`);
});
