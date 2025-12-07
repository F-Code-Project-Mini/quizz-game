import publicApi from "~/lib/axios-instance";
import type { QuizFormInput } from "~/types/quiz.types";

class QuizRequest {
    static createQuiz(payload: QuizFormInput) {
        return publicApi.post("/room/create-quiz", payload);
    }
}

export default QuizRequest;
