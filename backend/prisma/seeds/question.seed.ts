import { IQuestionType } from "./../../src/constants/enums";
import { PrismaClient } from "@prisma/client";
import Question from "../../src/schemas/questions";
import Answer from "../../src/schemas/answer.schema";
const prisma = new PrismaClient();
const clubSeed = async () => {
    await prisma.question.deleteMany({});
    await prisma.answer.deleteMany({});

    const [user, room] = await Promise.all([
        prisma.user.findFirst({
            select: { id: true },
        }),
        prisma.room.findFirst({
            select: { id: true },
        }),
    ]);

    const questionsData = [
        {
            question: "Thủ đô của Việt Nam là gì?",
            score: 10,
            answers: [
                { text: "Hà Nội", isCorrect: true },
                { text: "Hồ Chí Minh", isCorrect: false },
                { text: "Đà Nẵng", isCorrect: false },
                { text: "Huế", isCorrect: false },
            ],
        },
        {
            question: "Ai là tác giả của bài thơ 'Đất Nước'?",
            score: 15,
            answers: [
                { text: "Nguyễn Khoa Điềm", isCorrect: true },
                { text: "Xuân Diệu", isCorrect: false },
                { text: "Huy Cận", isCorrect: false },
                { text: "Tố Hữu", isCorrect: false },
            ],
        },
        {
            question: "Biển Đông thuộc đại dương nào?",
            score: 10,
            answers: [
                { text: "Thái Bình Dương", isCorrect: true },
                { text: "Ấn Độ Dương", isCorrect: false },
                { text: "Đại Tây Dương", isCorrect: false },
                { text: "Bắc Băng Dương", isCorrect: false },
            ],
        },
        {
            question: "Ngày Quốc khánh Việt Nam là ngày nào?",
            score: 10,
            answers: [
                { text: "2/9", isCorrect: true },
                { text: "30/4", isCorrect: false },
                { text: "1/5", isCorrect: false },
                { text: "19/5", isCorrect: false },
            ],
        },
        {
            question: "Núi cao nhất Việt Nam là núi gì?",
            score: 15,
            answers: [
                { text: "Phan Xi Păng", isCorrect: true },
                { text: "Bà Đen", isCorrect: false },
                { text: "Ngọc Linh", isCorrect: false },
                { text: "Bạch Mã", isCorrect: false },
            ],
        },
        {
            question: "Công thức hóa học của nước là gì?",
            score: 10,
            answers: [
                { text: "H₂O", isCorrect: true },
                { text: "CO₂", isCorrect: false },
                { text: "O₂", isCorrect: false },
                { text: "H₂SO₄", isCorrect: false },
            ],
        },
        {
            question: "Vịnh Hạ Long thuộc tỉnh nào?",
            score: 10,
            answers: [
                { text: "Quảng Ninh", isCorrect: true },
                { text: "Hải Phòng", isCorrect: false },
                { text: "Thanh Hóa", isCorrect: false },
                { text: "Nghệ An", isCorrect: false },
            ],
        },
        {
            question: "Python là ngôn ngữ lập trình thuộc loại nào?",
            score: 15,
            answers: [
                { text: "High-level", isCorrect: true },
                { text: "Assembly", isCorrect: false },
                { text: "Machine code", isCorrect: false },
                { text: "Binary", isCorrect: false },
            ],
        },
        {
            question: "Trong hệ thống thập phân, số 10 trong hệ nhị phân là gì?",
            score: 20,
            answers: [
                { text: "1010", isCorrect: true },
                { text: "1001", isCorrect: false },
                { text: "1100", isCorrect: false },
                { text: "1111", isCorrect: false },
            ],
        },
        {
            question: "Trái đất quay quanh Mặt trời hết bao nhiêu ngày?",
            score: 10,
            answers: [
                { text: "365 ngày", isCorrect: true },
                { text: "360 ngày", isCorrect: false },
                { text: "30 ngày", isCorrect: false },
                { text: "100 ngày", isCorrect: false },
            ],
        },
    ];

    for (const qData of questionsData) {
        const question = await prisma.question.create({
            data: new Question({
                roomId: room!.id,
                question: qData.question,
                score: qData.score,
                type: IQuestionType.MULTIPLE_CHOICE,
                userId: user!.id,
            }),
        });

        const answers = qData.answers.map(
            (ans) =>
                new Answer({
                    id: "",
                    questionId: question.id,
                    answer: ans.text,
                    isCorrect: ans.isCorrect,
                }),
        );

        await prisma.answer.createMany({
            data: answers,
        });
    }
};
export default clubSeed;
