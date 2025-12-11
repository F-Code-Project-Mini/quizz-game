import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import QuizRequest from "~/requests/quiz.requests";
import type { QuizAnswerInput, QuizFormInput, QuizQuestionInput, QuizType } from "~/types/quiz.types";

type QuestionError = {
    question?: string;
    answers?: string;
    correct?: string;
    timeQuestion?: string;
    score?: string;
};

const QUESTION_TYPES: { label: string; value: QuizType }[] = [
    { label: "Single choice", value: "SINGLE_CHOICE" },
    { label: "Multiple choice", value: "MULTIPLE_CHOICE" },
    { label: "True / False", value: "TRUE_FALSE" },
];

const createEmptyAnswer = (): QuizAnswerInput => ({
    answer: "",
    isCorrect: false,
});

const createEmptyQuestion = (): QuizQuestionInput => ({
    question: "",
    type: "SINGLE_CHOICE",
    timeQuestion: 20,
    score: 20,
    answers: [createEmptyAnswer(), createEmptyAnswer(), createEmptyAnswer(), createEmptyAnswer()],
});

const createTrueFalseQuestion = (): QuizQuestionInput => ({
    question: "",
    type: "TRUE_FALSE",
    timeQuestion: 20,
    score: 20,
    answers: [
        { answer: "True", isCorrect: false },
        { answer: "False", isCorrect: false },
    ],
});

const normalizeCorrectAnswers = (question: QuizQuestionInput, index: number) => {
    if (question.type === "MULTIPLE_CHOICE") {
        return question.answers.map((ans, ansIdx) => (ansIdx === index ? { ...ans, isCorrect: !ans.isCorrect } : ans));
    }
    return question.answers.map((ans, ansIdx) => ({ ...ans, isCorrect: ansIdx === index }));
};

const DEFAULT_HOST_ID = "51c5e42c-5af4-46a1-8e43-1f28998cfdb3";

const CreateQuizPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<QuizFormInput>({
        name: "",
        description: "",
        questions: [createEmptyQuestion()],
    });
    const [errors, setErrors] = useState<{ name?: string; questions: QuestionError[] }>({ questions: [] });
    const [submitError, setSubmitError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: (payload: QuizFormInput) => QuizRequest.createQuiz(payload),
        onSuccess: () => {
            alert("Created quiz/room successfully!");
            window.location.reload();
        },
        onError: (err) => {
            console.error(err);
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message || "Failed to create quiz, please try again.";
                setSubmitError(msg);
            } else {
                setSubmitError("Failed to create quiz, please try again.");
            }
        },
    });

    const resetQuestionErrors = (count: number): QuestionError[] => Array.from({ length: count }, () => ({}));

    const clearQuestionError = (idx: number, keys?: (keyof QuestionError)[]) => {
        setErrors((prev) => {
            const nextQuestions = resetQuestionErrors(Math.max(prev.questions.length, form.questions.length));
            prev.questions.forEach((e, i) => {
                nextQuestions[i] = { ...e };
            });
            if (nextQuestions[idx]) {
                if (keys && keys.length > 0) {
                    keys.forEach((k) => {
                        delete nextQuestions[idx][k];
                    });
                } else {
                    nextQuestions[idx] = {};
                }
            }
            return { ...prev, questions: nextQuestions };
        });
    };

    const validate = (data: QuizFormInput) => {
        const nextErrors: { name?: string; questions: QuestionError[] } = { questions: resetQuestionErrors(data.questions.length) };
        let hasError = false;

        if (!data.name.trim()) {
            nextErrors.name = "Room name is required";
            hasError = true;
        }
        if (data.questions.length === 0) {
            nextErrors.questions = [{ question: "At least one question is required" }];
            hasError = true;
        }

        data.questions.forEach((q, idx) => {
            if (!q.question.trim()) {
                nextErrors.questions[idx] = { ...nextErrors.questions[idx], question: "Question content is required" };
                hasError = true;
            }
            if (!Number.isInteger(q.timeQuestion) || q.timeQuestion <= 0) {
                nextErrors.questions[idx] = { ...nextErrors.questions[idx], timeQuestion: "Time must be a positive integer" };
                hasError = true;
            }
            if (!Number.isInteger(q.score) || q.score <= 0) {
                nextErrors.questions[idx] = { ...nextErrors.questions[idx], score: "Score must be a positive integer" };
                hasError = true;
            }
            if (!q.answers.length || q.answers.some((a) => !a.answer.trim())) {
                nextErrors.questions[idx] = { ...nextErrors.questions[idx], answers: "Each answer must not be empty" };
                hasError = true;
            }
            const correctCount = q.answers.filter((a) => a.isCorrect).length;
            if ((q.type === "SINGLE_CHOICE" || q.type === "TRUE_FALSE") && correctCount !== 1) {
                nextErrors.questions[idx] = { ...nextErrors.questions[idx], correct: "Must select exactly 1 correct answer" };
                hasError = true;
            }
            if (q.type === "MULTIPLE_CHOICE" && correctCount < 1) {
                nextErrors.questions[idx] = { ...nextErrors.questions[idx], correct: "Need at least 1 correct answer" };
                hasError = true;
            }
        });

        setErrors(nextErrors);
        return !hasError;
    };

    const handleAddQuestion = () => {
        setSubmitError(null);
        const nextLength = form.questions.length + 1;
        setForm((prev) => ({
            ...prev,
            questions: [...prev.questions, createEmptyQuestion()],
        }));
        setErrors((prev) => ({ ...prev, questions: resetQuestionErrors(nextLength) }));
    };

    const handleRemoveQuestion = (idx: number) => {
        setSubmitError(null);
        const nextLength = Math.max(form.questions.length - 1, 0);
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, qIdx) => qIdx !== idx),
        }));
        setErrors((prev) => ({ ...prev, questions: resetQuestionErrors(nextLength) }));
    };

    const handleQuestionFieldChange = (idx: number, field: keyof QuizQuestionInput, value: string | number) => {
        setSubmitError(null);
        clearQuestionError(idx, [field as keyof QuestionError]);
        setForm((prev) => {
            const nextQuestions = prev.questions.map((q, qIdx) => {
                if (qIdx !== idx) return q;
                return { ...q, [field]: value };
            });
            return { ...prev, questions: nextQuestions };
        });
    };

    const handleQuestionTypeChange = (idx: number, type: QuizType) => {
        setSubmitError(null);
        clearQuestionError(idx, ["correct", "answers"]);
        setForm((prev) => {
            const updated = [...prev.questions];
            const target = { ...updated[idx] };
            target.type = type;

            if (type === "TRUE_FALSE") {
                target.answers = createTrueFalseQuestion().answers;
            } else {
                target.answers = [createEmptyAnswer(), createEmptyAnswer(), createEmptyAnswer(), createEmptyAnswer()];
            }

            target.answers = target.answers.map((a) => ({ ...a, isCorrect: false }));

            updated[idx] = target;
            return { ...prev, questions: updated };
        });
    };

    const handleAnswerChange = (qIdx: number, aIdx: number, value: string) => {
        setSubmitError(null);
        clearQuestionError(qIdx, ["answers", "correct"]);
        setForm((prev) => {
            const updated = [...prev.questions];
            const target = { ...updated[qIdx] };
            target.answers = target.answers.map((ans, idx) => (idx === aIdx ? { ...ans, answer: value } : ans));
            updated[qIdx] = target;
            return { ...prev, questions: updated };
        });
    };

    const handleToggleCorrect = (qIdx: number, aIdx: number) => {
        setSubmitError(null);
        clearQuestionError(qIdx, ["correct"]);
        setForm((prev) => {
            const updated = [...prev.questions];
            const target = { ...updated[qIdx] };
            target.answers = normalizeCorrectAnswers(target, aIdx);
            updated[qIdx] = target;
            return { ...prev, questions: updated };
        });
    };

    const handleAddAnswer = (qIdx: number) => {
        setSubmitError(null);
        clearQuestionError(qIdx, ["answers", "correct"]);
        setForm((prev) => {
            const updated = [...prev.questions];
            const target = { ...updated[qIdx] };
            target.answers = [...target.answers, createEmptyAnswer()];
            updated[qIdx] = target;
            return { ...prev, questions: updated };
        });
    };

    const handleRemoveAnswer = (qIdx: number, aIdx: number) => {
        setSubmitError(null);
        clearQuestionError(qIdx, ["answers", "correct"]);
        setForm((prev) => {
            const updated = [...prev.questions];
            const target = { ...updated[qIdx] };
            target.answers = target.answers.filter((_, idx) => idx !== aIdx);
            updated[qIdx] = target;
            return { ...prev, questions: updated };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        if (!validate(form)) return;
        mutation.mutate({ ...form, userId: DEFAULT_HOST_ID });
    };

    const isSubmitting = mutation.isPending;

    return (
        <div className="bg-slate-50 py-8">
            <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create room / quiz</h1>
                        <p className="text-sm text-gray-600">Enter room info and list of questions</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Room name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={form.name}
                            onChange={(e) => {
                                setSubmitError(null);
                                setErrors((prev) => ({ ...prev, name: undefined }));
                                setForm((prev) => ({ ...prev, name: e.target.value }));
                            }}
                            placeholder="Enter room/quiz name"
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Description (optional)</label>
                        <Input
                            value={form.description}
                            onChange={(e) => {
                                setSubmitError(null);
                                setForm((prev) => ({ ...prev, description: e.target.value }));
                            }}
                            placeholder="Short description"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
                        <Button type="button" variant="fuchsia" onClick={handleAddQuestion} tabIndex={-1}>
                            Add question
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {form.questions.map((question, qIdx) => (
                            <div key={qIdx} className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 shadow-sm">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Question <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={question.question}
                                        onChange={(e) => handleQuestionFieldChange(qIdx, "question", e.target.value)}
                                        placeholder="Enter question content"
                                    />
                                    {errors.questions[qIdx]?.question && (
                                        <p className="text-sm text-red-600">{errors.questions[qIdx]?.question}</p>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Type</label>
                                        <Select
                                            value={question.type}
                                            onValueChange={(value) => handleQuestionTypeChange(qIdx, value as QuizType)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Types</SelectLabel>
                                                    {QUESTION_TYPES.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Time (seconds) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={question.timeQuestion}
                                            onChange={(e) =>
                                                handleQuestionFieldChange(qIdx, "timeQuestion", Number(e.target.value))
                                            }
                                        />
                                        {errors.questions[qIdx]?.timeQuestion && (
                                            <p className="text-sm text-red-600">{errors.questions[qIdx]?.timeQuestion}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Score <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={question.score}
                                            onChange={(e) => handleQuestionFieldChange(qIdx, "score", Number(e.target.value))}
                                        />
                                        {errors.questions[qIdx]?.score && (
                                            <p className="text-sm text-red-600">{errors.questions[qIdx]?.score}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-700">Answers</p>
                                        {question.type !== "TRUE_FALSE" && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleAddAnswer(qIdx)}
                                                tabIndex={-1}
                                            >
                                                Add answer
                                            </Button>
                                        )}
                                    </div>

                                    {question.answers.map((ans, aIdx) => (
                                        <div key={aIdx} className="flex items-center gap-3">
                                            <input
                                                type={question.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
                                                className="h-5 w-5 cursor-pointer accent-fuchsia-600"
                                                checked={ans.isCorrect}
                                                onChange={() => handleToggleCorrect(qIdx, aIdx)}
                                            />
                                            <Input
                                                value={ans.answer}
                                                onChange={(e) => handleAnswerChange(qIdx, aIdx, e.target.value)}
                                                placeholder={`Answer ${aIdx + 1}`}
                                            />
                                            {question.type !== "TRUE_FALSE" && question.answers.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveAnswer(qIdx, aIdx)}
                                                    tabIndex={-1}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {errors.questions[qIdx]?.answers && (
                                        <p className="text-sm text-red-600">{errors.questions[qIdx]?.answers}</p>
                                    )}
                                    {errors.questions[qIdx]?.correct && (
                                        <p className="text-sm text-red-600">{errors.questions[qIdx]?.correct}</p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    {form.questions.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => handleRemoveQuestion(qIdx)}
                                            tabIndex={-1}
                                        >
                                            Delete question
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                    <div className="flex items-center gap-3">
                        <Button type="submit" variant="fuchsia" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Create room"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => navigate("/")} tabIndex={-1}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuizPage;
