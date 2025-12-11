import z from "zod/v3";
import { IQuestionType } from "~/constants/enums";

export const createQuizRule = z
    .object({
        body: z.object({
            name: z.string().min(1, "Tên phòng không được để trống"),
            description: z.string().optional(),
            userId: z.string().uuid("userId không hợp lệ"),
            questions: z
                .array(
                    z.object({
                        question: z.string().min(1, "Nội dung câu hỏi không được để trống"),
                        type: z.nativeEnum(IQuestionType),
                        timeQuestion: z.number().int().positive("Thời gian phải là số nguyên dương"),
                        score: z.number().int().positive("Điểm phải là số nguyên dương"),
                        answers: z
                            .array(
                                z.object({
                                    answer: z.string().min(1, "Đáp án không được để trống"),
                                    isCorrect: z.boolean(),
                                }),
                            )
                            .min(1, "Mỗi câu hỏi cần ít nhất 1 đáp án"),
                    }),
                )
                .min(1, "Cần ít nhất một câu hỏi"),
        }),
    })
    .superRefine((data, ctx) => {
        data.body.questions.forEach((q, idx) => {
            const correctCount = q.answers.filter((a) => a.isCorrect).length;

            if (q.type === IQuestionType.SINGLE_CHOICE || q.type === IQuestionType.TRUE_FALSE) {
                if (correctCount !== 1) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Phải có đúng 1 đáp án đúng",
                        path: ["body", "questions", idx, "answers"],
                    });
                }
            }
            if (q.type === IQuestionType.MULTIPLE_CHOICE && correctCount < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Cần ít nhất 1 đáp án đúng",
                    path: ["body", "questions", idx, "answers"],
                });
            }
            if (q.type === IQuestionType.TRUE_FALSE && q.answers.length !== 2) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Câu hỏi True/False phải có đúng 2 đáp án",
                    path: ["body", "questions", idx, "answers"],
                });
            }
        });
    });
