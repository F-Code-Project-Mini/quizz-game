import { useState, useEffect } from "react";
import QuizCard from "~/components/QuizCard";
import AnswerButton from "~/components/AnswerButton";
import ScoreBoard from "~/components/ScoreBoard";
import { Circle, Square, Triangle, Star } from "lucide-react";

// Mock data - trong thực tế sẽ lấy từ props hoặc socket
const mockQuiz = {
    question: "Thủ đô của Việt Nam là gì?",
    answers: [
        { id: 1, text: "Hà Nội", isCorrect: true, color: "red" as const },
        { id: 2, text: "Hồ Chí Minh", isCorrect: false, color: "blue" as const },
        { id: 3, text: "Đà Nẵng", isCorrect: false, color: "yellow" as const },
        { id: 4, text: "Cần Thơ", isCorrect: false, color: "green" as const },
    ],
};

const answerIcons = {
    red: <Circle className="h-8 w-8" />,
    blue: <Square className="h-8 w-8" />,
    yellow: <Triangle className="h-8 w-8" />,
    green: <Star className="h-8 w-8" />,
};

const RunningPage = () => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0 && !showResult) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResult) {
            // Time's up - show results
            setShowResult(true);
        }
    }, [timeLeft, showResult]);

    const handleAnswerClick = (answerId: number) => {
        if (showResult || selectedAnswer !== null) return;

        setSelectedAnswer(answerId);

        // Show result after a short delay
        setTimeout(() => {
            setShowResult(true);

            // Check if correct
            const answer = mockQuiz.answers.find((a) => a.id === answerId);
            if (answer?.isCorrect) {
                // Calculate score with time bonus
                const timeBonus = timeLeft * 10;
                const baseScore = 1000;
                setScore((prev) => prev + baseScore + timeBonus);
                setStreak((prev) => prev + 1);
                setCorrectAnswers((prev) => prev + 1);
            } else {
                setStreak(0);
            }

            // Move to next question after showing result
            setTimeout(() => {
                // Reset for next question
                setSelectedAnswer(null);
                setShowResult(false);
                setTimeLeft(30);
            }, 3000);
        }, 500);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-game">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute -left-1/4 top-0 h-96 w-96 animate-float rounded-full bg-purple-500/20 blur-3xl"></div>
                <div
                    className="absolute -right-1/4 top-1/3 h-96 w-96 animate-float rounded-full bg-pink-500/20 blur-3xl"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-0 left-1/3 h-96 w-96 animate-float rounded-full bg-yellow-500/20 blur-3xl"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            {/* Score Board */}
            <ScoreBoard score={score} streak={streak} correctAnswers={correctAnswers} totalQuestions={10} />

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-full max-w-5xl">
                    {/* Quiz Question */}
                    <QuizCard question={mockQuiz.question} questionNumber={1} totalQuestions={10} timeLeft={timeLeft} />

                    {/* Answer Buttons */}
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {mockQuiz.answers.map((answer) => (
                            <AnswerButton
                                key={answer.id}
                                answer={answer.text}
                                color={answer.color}
                                icon={answerIcons[answer.color]}
                                onClick={() => handleAnswerClick(answer.id)}
                                isSelected={selectedAnswer === answer.id}
                                isCorrect={answer.isCorrect}
                                showResult={showResult}
                                disabled={showResult || selectedAnswer !== null}
                            />
                        ))}
                    </div>

                    {/* Result Message */}
                    {showResult && (
                        <div className="mt-6 animate-scale-in text-center">
                            {mockQuiz.answers.find((a) => a.id === selectedAnswer)?.isCorrect ? (
                                <div className="glass-effect-strong rounded-2xl p-6">
                                    <p className="text-3xl font-black text-green-600">
                                        🎉 Chính xác! +{1000 + timeLeft * 10} điểm
                                    </p>
                                    {streak > 1 && (
                                        <p className="mt-2 text-xl font-bold text-purple-600">
                                            🔥 Chuỗi {streak} câu đúng!
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="glass-effect-strong rounded-2xl p-6">
                                    <p className="text-3xl font-black text-red-600">❌ Sai rồi!</p>
                                    <p className="mt-2 text-xl font-bold text-gray-700">
                                        Đáp án đúng: {mockQuiz.answers.find((a) => a.isCorrect)?.text}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RunningPage;
