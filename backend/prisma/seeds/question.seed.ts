import { IQuestionType } from "./../../src/constants/enums";
import { PrismaClient } from "@prisma/client";
import Question from "../../src/schemas/questions";
import Answer from "../../src/schemas/answer.schema";
const prisma = new PrismaClient();
const clubSeed = async () => {
    await prisma.question.deleteMany({});
    const [user, room] = await Promise.all([
        prisma.user.findFirst({
            select: { id: true },
        }),
        prisma.room.findFirst({
            select: { id: true },
        }),
    ]);

    const question = await prisma.question.create({
        data: new Question({
            roomId: room!.id,
            question: "What is the capital of France?",
            score: 20,
            type: IQuestionType.MULTIPLE_CHOICE,
            userId: user!.id,
        }),
    });

    await prisma.answer.deleteMany({});
    const answers = [];
    for (let i = 1; i <= 4; i++) {
        answers.push(
            new Answer({
                id: "",
                questionId: question.id,
                answer: `Answer ${i}`,
                isCorrect: i === 2,
            }),
        );
    }

    await prisma.answer.createMany({
        data: answers,
    });
};
export default clubSeed;
