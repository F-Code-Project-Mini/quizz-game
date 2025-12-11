import { NextFunction, Request, Response } from "express";
import prisma from "~/configs/prisma";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import RedisCache from "~/utils/redis-cache";
import { IRoomStatus } from "~/constants/enums";

export const startGameController = async (req: Request<{ roomId: string }>, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.room.findUnique({
            where: { id: roomId },
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
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Phòng không tồn tại",
            });
        }

        if (room.status !== IRoomStatus.WAITING) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Phòng đã bắt đầu hoặc kết thúc",
            });
        }

        if (room.questions.length === 0) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Phòng chưa có câu hỏi nào",
            });
        }

        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data: {
                status: IRoomStatus.IN_PROGRESS,
                startedAt: new Date(),
                currentQuestionIndex: 0,
            },
        });

        await RedisCache.setGameState(roomId, {
            roomId,
            currentQuestionIndex: 0,
            startedAt: new Date().toISOString(),
            questionStartedAt: new Date().toISOString(),
            isActive: true,
            totalQuestions: room.questions.length,
        });

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: updatedRoom,
        });
    } catch (error) {
        next(error);
    }
};

export const nextQuestionController = async (req: Request<{ roomId: string }>, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                questions: true,
            },
        });

        if (!room) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Phòng không tồn tại",
            });
        }

        if (room.status !== IRoomStatus.IN_PROGRESS) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Phòng chưa bắt đầu hoặc đã kết thúc",
            });
        }

        const nextIndex = room.currentQuestionIndex + 1;

        if (nextIndex >= room.questions.length) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Đã hết câu hỏi",
            });
        }

        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data: {
                currentQuestionIndex: nextIndex,
            },
        });

        const gameState = await RedisCache.getGameState(roomId);
        if (gameState) {
            await RedisCache.setGameState(roomId, {
                ...gameState,
                currentQuestionIndex: nextIndex,
                questionStartedAt: new Date().toISOString(),
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: updatedRoom,
        });
    } catch (error) {
        next(error);
    }
};

export const endGameController = async (req: Request<{ roomId: string }>, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (!room) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Phòng không tồn tại",
            });
        }

        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data: {
                status: IRoomStatus.FINISHED,
            },
        });

        const gameState = await RedisCache.getGameState(roomId);
        if (gameState) {
            await RedisCache.setGameState(roomId, {
                ...gameState,
                isActive: false,
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: updatedRoom,
        });
    } catch (error) {
        next(error);
    }
};

export const resetGameController = async (req: Request<{ roomId: string }>, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                questions: true,
            },
        });

        if (!room) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Phòng không tồn tại",
            });
        }

        // Delete all player answers from previous games
        await prisma.playerAnswer.deleteMany({
            where: {
                questionId: {
                    in: room.questions.map((q) => q.id),
                },
            },
        });

        // Reset all player scores
        await prisma.player.updateMany({
            where: { roomId },
            data: { score: 0 },
        });

        // Reset room to waiting state
        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data: {
                status: IRoomStatus.WAITING,
                currentQuestionIndex: 0,
                startedAt: null,
            },
        });

        // Clear cache
        await RedisCache.clearRoomData(roomId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: updatedRoom,
            message: "Phòng đã được reset, có thể chơi lại",
        });
    } catch (error) {
        next(error);
    }
};

export const getRoomStateController = async (req: Request<{ roomId: string }>, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                    orderBy: { createdAt: "asc" },
                },
                players: {
                    include: {
                        club: true,
                    },
                },
            },
        });

        if (!room) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Phòng không tồn tại",
            });
        }

        const gameState = await RedisCache.getGameState(roomId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: {
                room,
                gameState,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getLeaderboardController = async (req: Request<{ roomId: string }>, res: Response, next: NextFunction) => {
    try {
        const { roomId } = req.params;

        const players = await prisma.player.findMany({
            where: { roomId },
            include: {
                club: true,
            },
            orderBy: { score: "desc" },
            take: 10,
        });

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: players,
        });
    } catch (error) {
        next(error);
    }
};

export const submitAnswerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playerId, questionId, answerId, roomId } = req.body;

        const [player, question, answer] = await Promise.all([
            prisma.player.findUnique({ where: { id: playerId } }),
            prisma.question.findUnique({ where: { id: questionId } }),
            prisma.answer.findUnique({ where: { id: answerId } }),
        ]);

        if (!player || !question || !answer) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Dữ liệu không hợp lệ",
            });
        }

        const existingAnswer = await prisma.playerAnswer.findUnique({
            where: {
                playerId_questionId: {
                    playerId,
                    questionId,
                },
            },
        });

        if (existingAnswer) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Bạn đã trả lời câu hỏi này rồi",
            });
        }

        const gameState = await RedisCache.getGameState(roomId);
        if (!gameState) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Trò chơi chưa bắt đầu",
            });
        }

        const now = new Date();
        const questionStartTime = new Date(gameState.questionStartedAt);
        const timeElapsed = (now.getTime() - questionStartTime.getTime()) / 1000;

        let score = 0;
        if (answer.isCorrect && timeElapsed <= question.timeQuestion) {
            const timeBonus = Math.max(0, 1 - timeElapsed / question.timeQuestion);
            score = Math.round(question.score * (0.5 + 0.5 * timeBonus));
        }

        const playerAnswer = await prisma.playerAnswer.create({
            data: {
                playerId,
                questionId,
                answerId,
                roomId,
                score,
                answeredAt: now,
            },
        });

        await prisma.player.update({
            where: { id: playerId },
            data: {
                score: {
                    increment: score,
                },
            },
        });

        await RedisCache.incrementPlayerScore(roomId, playerId, score);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: {
                playerAnswer,
                score,
                isCorrect: answer.isCorrect,
            },
        });
    } catch (error) {
        next(error);
    }
};
