import { randomUUID } from "crypto";

interface AnswerType {
    id?: string;
    questionId: string;
    answer: string;
    isCorrect: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

class Answer {
    id: string;
    questionId: string;
    answer: string;
    isCorrect: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: AnswerType) {
        this.id = user.id || randomUUID();
        this.questionId = user.questionId;
        this.answer = user.answer;
        this.isCorrect = user.isCorrect;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Answer;
