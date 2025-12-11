import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Circle, Square, Triangle, Star, Trophy } from "lucide-react";
import { socket } from "~/configs/socket";
import Swal from "sweetalert2";

const answerShapes = [
    {
        icon: <Circle className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />,
        color: "from-red-500 to-red-600",
        label: "A",
    },
    {
        icon: <Square className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />,
        color: "from-blue-500 to-blue-600",
        label: "B",
    },
    {
        icon: <Triangle className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />,
        color: "from-yellow-500 to-yellow-600",
        label: "C",
    },
    {
        icon: <Star className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />,
        color: "from-green-500 to-green-600",
        label: "D",
    },
];

interface Question {
    id: string;
    question: string;
    timeQuestion: number;
    answers: Array<{
        id: string;
        answer: string;
        isCorrect: boolean;
    }>;
}

const RunningPage = () => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const playerInfo = localStorage.getItem("player") ? JSON.parse(localStorage.getItem("player")!) : null;
    const roomInfo = localStorage.getItem("room") ? JSON.parse(localStorage.getItem("room")!) : null;

    useEffect(() => {
        if (!playerInfo || !roomInfo) {
            navigate("/");
            return;
        }

        socket.on("sync_game_state", (data) => {
            setCurrentQuestion(data.question);
            setQuestionIndex(data.currentQuestionIndex);
            setTotalQuestions(data.totalQuestions);
            setTimeLeft(data.question.timeQuestion);
            setHasAnswered(false);
            setSelectedAnswer(null);
            setIsCorrect(null);
        });

        socket.on("game_started", (data) => {
            setCurrentQuestion(data.question);
            setQuestionIndex(data.currentQuestionIndex);
            setTotalQuestions(data.totalQuestions);
            setTimeLeft(data.question.timeQuestion);
        });

        socket.on("next_question", (data) => {
            setCurrentQuestion(data.question);
            setQuestionIndex(data.currentQuestionIndex);
            setTotalQuestions(data.totalQuestions);
            setTimeLeft(data.question.timeQuestion);
            setHasAnswered(false);
            setSelectedAnswer(null);
            setIsCorrect(null);
        });

        socket.on("answer_result", (data) => {
            setIsCorrect(data.isCorrect);
            setScore(data.totalScore);
            setTimeout(() => {
                setIsCorrect(null);
            }, 3000);
        });

        socket.on("answer_error", (data) => {
            Swal.fire({
                title: "Lỗi",
                text: data.message,
                icon: "error",
                timer: 2000,
            });
        });

        socket.on("game_ended", (data) => {
            localStorage.setItem("final_leaderboard", JSON.stringify(data.leaderboard));
            navigate("/result");
        });

        return () => {
            socket.off("sync_game_state");
            socket.off("game_started");
            socket.off("next_question");
            socket.off("answer_result");
            socket.off("answer_error");
            socket.off("game_ended");
        };
    }, []);

    useEffect(() => {
        if (!currentQuestion || hasAnswered) return;

        setTimeLeft(currentQuestion.timeQuestion);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, hasAnswered]);

    const handleAnswerClick = async (answerIndex: number) => {
        if (hasAnswered || !currentQuestion || timeLeft === 0) return;

        setSelectedAnswer(answerIndex);
        setHasAnswered(true);

        const answer = currentQuestion.answers[answerIndex];

        try {
            socket.emit("submit_answer", {
                roomId: roomInfo.id,
                playerId: playerInfo.id,
                questionId: currentQuestion.id,
                answerId: answer.id,
            });
        } catch (error) {
            console.error("Error submitting answer:", error);
            setHasAnswered(false);
            setSelectedAnswer(null);
        }
    };

    if (!currentQuestion) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-game">
                <div className="text-center text-white">
                    <div className="mb-4 h-16 w-16 mx-auto animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                    <p className="text-2xl font-bold">Đang chờ câu hỏi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-game">
            <div className="absolute inset-0">
                <div className="absolute -left-1/4 top-0 h-96 w-96 animate-float rounded-full bg-purple-500/20 blur-3xl"></div>
                <div
                    className="absolute -right-1/4 top-1/3 h-96 w-96 animate-float rounded-full bg-pink-500/20 blur-3xl"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>

            <div className="relative z-10 flex min-h-screen flex-col p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-white/90 px-4 py-2 shadow-lg">
                        <p className="text-sm font-bold text-gray-700">
                            Câu {questionIndex + 1}/{totalQuestions}
                        </p>
                    </div>
                    <div className="rounded-xl bg-white/90 px-4 py-2 shadow-lg">
                        <p
                            className={`text-lg font-black ${timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-gray-800"}`}
                        >
                            {timeLeft}s
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 shadow-lg">
                        <Trophy className="h-5 w-5 text-purple-600" />
                        <p className="text-lg font-black text-purple-600">{score}</p>
                    </div>
                </div>

                {isCorrect !== null && (
                    <div
                        className={`mb-4 rounded-2xl p-4 text-center text-white shadow-lg animate-scale-in ${
                            isCorrect
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-red-500 to-red-600"
                        }`}
                    >
                        <p className="text-2xl font-black">{isCorrect ? "Chính xác!" : "Sai rồi!"}</p>
                    </div>
                )}

                <div className="mb-6 rounded-2xl bg-white/90 p-6 text-center shadow-xl">
                    <p className="text-xl font-bold text-gray-800">Nhìn lên màn hình và chọn đáp án</p>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-4">
                    {answerShapes.map((shape, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerClick(index)}
                            disabled={hasAnswered || index >= currentQuestion.answers.length}
                            className={`flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${shape.color} p-8 text-white shadow-2xl transition-all disabled:opacity-50 ${
                                selectedAnswer === index
                                    ? "scale-95 ring-8 ring-white"
                                    : "hover:scale-105 active:scale-95"
                            } ${index >= currentQuestion.answers.length ? "invisible" : ""}`}
                        >
                            {shape.icon}
                            <span className="mt-4 text-4xl font-black">{shape.label}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-4 rounded-xl bg-white/90 p-3 text-center shadow-lg">
                    <p className="text-sm font-bold text-gray-700">{playerInfo?.fullName}</p>
                </div>
            </div>
        </div>
    );
};

export default RunningPage;
