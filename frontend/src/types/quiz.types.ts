export type QuizType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE";

export interface QuizAnswerInput {
    answer: string;
    isCorrect: boolean;
}

export interface QuizQuestionInput {
    question: string;
    type: QuizType;
    timeQuestion: number;
    score: number;
    answers: QuizAnswerInput[];
}

export interface QuizFormInput {
    name: string;
    description?: string;
    userId?: string;
    questions: QuizQuestionInput[];
}
