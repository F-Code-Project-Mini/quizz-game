import { NextFunction, Request, Response } from "express";
import prisma from "~/configs/prisma";
import type { PrismaClient, Prisma } from "@prisma/client";
import { IQuestionType, IRoomStatus } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";

type CreateQuizBody = {
    name: string;
    description?: string;
    userId: string;
    questions: {
        question: string;
        type: IQuestionType;
        timeQuestion: number;
        score: number;
        answers: {
            answer: string;
            isCorrect: boolean;
        }[];
    }[];
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, "").trim();

const generateRoomCode = async (client: PrismaClient | Prisma.TransactionClient = prisma): Promise<string> => {
    for (let i = 0; i < 5; i++) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const existed = await client.room.count({ where: { code } });
        if (existed === 0) return code;
    }
    throw new ErrorWithStatus({
        status: HTTP_STATUS.SERVICE_UNAVAILABLE,
        message: "Cannot generate unique room code",
    });
};

export const createQuizController = async (
    req: Request<any, any, CreateQuizBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payload = req.body;

        payload.questions.forEach((q) => {
            const correctCount = q.answers.filter((a) => a.isCorrect).length;
            if ((q.type === IQuestionType.SINGLE_CHOICE || q.type === IQuestionType.TRUE_FALSE) && correctCount !== 1) {
                throw new ErrorWithStatus({
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: "Each SINGLE/TRUE_FALSE question must have exactly 1 correct answer",
                });
            }
            if (q.type === IQuestionType.MULTIPLE_CHOICE && correctCount < 1) {
                throw new ErrorWithStatus({
                    status: HTTP_STATUS.BAD_REQUEST,
                    message: "Each MULTIPLE_CHOICE question needs at least 1 correct answer",
                });
            }
        });

        const sanitizedName = stripHtml(payload.name);

        const result = await prisma.$transaction(async (tx) => {
            let room = await tx.room.findFirst({
                where: { name: sanitizedName },
            });

            if (!room) {
                const roomCode = await generateRoomCode(tx);
                room = await tx.room.create({
                    data: {
                        name: sanitizedName,
                        code: roomCode,
                        status: IRoomStatus.WAITING,
                        userId: payload.userId,
                    },
                });
            }

            for (const q of payload.questions) {
                const question = await tx.question.create({
                    data: {
                        roomId: room.id,
                        question: stripHtml(q.question),
                        type: q.type,
                        timeQuestion: q.timeQuestion,
                        score: q.score,
                        userId: payload.userId,
                    },
                });
                await tx.answer.createMany({
                    data: q.answers.map((a) => ({
                        questionId: question.id,
                        answer: stripHtml(a.answer),
                        isCorrect: a.isCorrect,
                    })),
                });
            }

            return room;
        });

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            result: {
                roomId: result.id,
                code: result.code,
            },
        });
    } catch (error) {
        next(error);
    }
};
