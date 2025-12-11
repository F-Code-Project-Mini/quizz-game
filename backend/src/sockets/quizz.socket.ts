import { Server, Socket } from "socket.io";
import prisma from "~/configs/prisma";
import RedisCache from "~/utils/redis-cache";

interface IJoinGame {
    roomCode: string;
    fullName: string;
    playerId: string;
    clubId: string;
}

interface ISubmitAnswer {
    roomId: string;
    playerId: string;
    questionId: string;
    answerId: string;
}

export interface Participant {
    id: string;
    fullName: string;
    clubId: string;
    playerId: string;
}

const roomsState = new Map<string, Participant[]>();

const handleJoinGame = async (socket: Socket, io: Server, data: IJoinGame) => {
    const { roomCode, fullName, playerId, clubId } = data;

    socket.join(roomCode);
    const newPlayer = { id: socket.id, fullName, playerId, clubId };

    if (!roomsState.has(roomCode)) {
        roomsState.set(roomCode, []);
    }

    if (!roomsState.get(roomCode)?.find((p) => p.playerId === playerId)) {
        roomsState.get(roomCode)?.push(newPlayer);
    }

    io.to(roomCode).emit(
        `update_participants_${clubId}`,
        roomsState.get(roomCode)?.filter((p) => p.clubId === clubId),
    );

    const room = await prisma.room.findUnique({
        where: { code: roomCode },
        include: {
            questions: {
                include: {
                    answers: true,
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (room) {
        const gameState = await RedisCache.getGameState(room.id);

        if (gameState && gameState.isActive) {
            socket.emit("sync_game_state", {
                currentQuestionIndex: gameState.currentQuestionIndex,
                questionStartedAt: gameState.questionStartedAt,
                totalQuestions: gameState.totalQuestions,
                question: room.questions[gameState.currentQuestionIndex],
            });
        }
    }
};

const handleStartGame = async (socket: Socket, io: Server, data: { roomCode: string }) => {
    const { roomCode } = data;

    const room = await prisma.room.findUnique({
        where: { code: roomCode },
        include: {
            questions: {
                include: {
                    answers: true,
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!room || room.questions.length === 0) {
        socket.emit("error", { message: "Phòng không hợp lệ hoặc chưa có câu hỏi" });
        return;
    }

    await prisma.room.update({
        where: { id: room.id },
        data: {
            status: "IN_PROGRESS",
            startedAt: new Date(),
            currentQuestionIndex: 0,
        },
    });

    await RedisCache.setGameState(room.id, {
        roomId: room.id,
        currentQuestionIndex: 0,
        startedAt: new Date().toISOString(),
        questionStartedAt: new Date().toISOString(),
        isActive: true,
        totalQuestions: room.questions.length,
    });

    io.to(roomCode).emit("game_started", {
        currentQuestionIndex: 0,
        question: room.questions[0],
        totalQuestions: room.questions.length,
    });
};

const handleNextQuestion = async (socket: Socket, io: Server, data: { roomCode: string }) => {
    const { roomCode } = data;

    const room = await prisma.room.findUnique({
        where: { code: roomCode },
        include: {
            questions: {
                include: {
                    answers: true,
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!room) {
        socket.emit("error", { message: "Phòng không tồn tại" });
        return;
    }

    const gameState = await RedisCache.getGameState(room.id);

    if (!gameState) {
        socket.emit("error", { message: "Trò chơi chưa bắt đầu" });
        return;
    }

    const nextIndex = gameState.currentQuestionIndex + 1;

    if (nextIndex >= room.questions.length) {
        await prisma.room.update({
            where: { id: room.id },
            data: { status: "FINISHED" },
        });

        await RedisCache.setGameState(room.id, {
            ...gameState,
            isActive: false,
        });

        const leaderboard = await prisma.player.findMany({
            where: { roomId: room.id },
            include: { club: true },
            orderBy: { score: "desc" },
        });

        io.to(roomCode).emit("game_ended", { leaderboard });
        return;
    }

    await prisma.room.update({
        where: { id: room.id },
        data: { currentQuestionIndex: nextIndex },
    });

    await RedisCache.setGameState(room.id, {
        ...gameState,
        currentQuestionIndex: nextIndex,
        questionStartedAt: new Date().toISOString(),
    });

    io.to(roomCode).emit("next_question", {
        currentQuestionIndex: nextIndex,
        question: room.questions[nextIndex],
        totalQuestions: room.questions.length,
    });
};

const handleSubmitAnswer = async (socket: Socket, io: Server, data: ISubmitAnswer) => {
    const { roomId, playerId, questionId, answerId } = data;

    try {
        const [player, question, answer, existingAnswer] = await Promise.all([
            prisma.player.findUnique({ where: { id: playerId }, include: { room: true } }),
            prisma.question.findUnique({ where: { id: questionId } }),
            prisma.answer.findUnique({ where: { id: answerId } }),
            prisma.playerAnswer.findUnique({
                where: {
                    playerId_questionId: { playerId, questionId },
                },
            }),
        ]);

        if (!player || !question || !answer) {
            socket.emit("answer_error", { message: "Dữ liệu không hợp lệ" });
            return;
        }

        if (existingAnswer) {
            socket.emit("answer_error", { message: "Bạn đã trả lời câu hỏi này" });
            return;
        }

        const gameState = await RedisCache.getGameState(roomId);
        if (!gameState || !gameState.isActive) {
            socket.emit("answer_error", { message: "Trò chơi chưa bắt đầu hoặc đã kết thúc" });
            return;
        }

        const now = new Date();
        const questionStartTime = new Date(gameState.questionStartedAt);
        const timeElapsed = (now.getTime() - questionStartTime.getTime()) / 1000;

        let score = 0;
        if (answer.isCorrect && timeElapsed <= question.timeQuestion) {
            const timeBonus = Math.max(0, 1 - timeElapsed / question.timeQuestion);
            score = Math.round(question.score * (0.5 + 0.5 * timeBonus));
        }

        await prisma.playerAnswer.create({
            data: { playerId, questionId, answerId, roomId, score, answeredAt: now },
        });

        const updatedPlayer = await prisma.player.update({
            where: { id: playerId },
            data: { score: { increment: score } },
            include: { club: true },
        });

        await RedisCache.incrementPlayerScore(roomId, playerId, score);

        socket.emit("answer_result", {
            isCorrect: answer.isCorrect,
            score,
            totalScore: updatedPlayer.score,
        });

        io.to(player.room.code).emit("player_answered", {
            playerId,
            playerName: player.fullName,
            score: updatedPlayer.score,
        });
    } catch (error) {
        console.error("Submit answer error:", error);
        socket.emit("answer_error", { message: "Có lỗi xảy ra khi nộp câu trả lời" });
    }
};

const handleDisconnect = (socket: Socket, io: Server) => {
    roomsState.forEach(async (participants, roomCode) => {
        const index = participants.findIndex((p) => p.id === socket.id);
        if (index !== -1) {
            const disconnectedPlayer = participants[index];
            participants.splice(index, 1);
            io.to(roomCode).emit(`update_participants_${disconnectedPlayer.clubId}`, participants);
        }
    });
};

const socketQuizz = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        socket.on("join_game", (data: IJoinGame) => handleJoinGame(socket, io, data));
        socket.on("start_game", (data: { roomCode: string }) => handleStartGame(socket, io, data));
        socket.on("next_question", (data: { roomCode: string }) => handleNextQuestion(socket, io, data));
        socket.on("submit_answer", (data: ISubmitAnswer) => handleSubmitAnswer(socket, io, data));
        socket.on("disconnect", () => handleDisconnect(socket, io));
    });
};

export default socketQuizz;
