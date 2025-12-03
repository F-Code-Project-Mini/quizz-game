import { v7 as uuidv7 } from "uuid";
import { IQuestionType } from "../constants/enums";

interface QuestionType {
    id?: string;
    roomId: string;
    question: string;
    score?: number;
    type: IQuestionType;
    timeQuestion?: number;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Question {
    id: string;
    roomId: string;
    question: string;
    score: number;
    type: IQuestionType;
    timeQuestion: number;
    userId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: QuestionType) {
        this.id = user.id || uuidv7();
        this.roomId = user.roomId;
        this.question = user.question;
        this.score = user.score || 20;
        this.timeQuestion = user.timeQuestion || 20;
        this.type = user.type || IQuestionType.MULTIPLE_CHOICE;
        this.userId = user.userId;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Question;
