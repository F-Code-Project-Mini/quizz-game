import { Timer } from "lucide-react";

interface QuizCardProps {
    question: string;
    questionNumber: number;
    totalQuestions: number;
    timeLeft?: number;
}

const QuizCard = ({ question, questionNumber, totalQuestions, timeLeft = 30 }: QuizCardProps) => {
    const timePercentage = (timeLeft / 30) * 100;

    return (
        <div className="animate-scale-in">
            {/* Question Header */}
            <div className="mb-4 sm:mb-6 text-center">
                <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2">
                    <Timer className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    <span className="text-xl sm:text-2xl font-black text-white">{timeLeft}s</span>
                </div>

                {/* Progress Bar */}
                <div className="mx-auto mb-3 sm:mb-4 h-1.5 sm:h-2 w-48 sm:w-64 overflow-hidden rounded-full bg-white/20">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-1000"
                        style={{ width: `${timePercentage}%` }}
                    ></div>
                </div>

                <p className="text-sm sm:text-base md:text-lg font-bold text-white/90">
                    Câu hỏi {questionNumber}/{totalQuestions}
                </p>
            </div>

            {/* Question Card */}
            <div className="glass-effect-strong mx-auto max-w-4xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl">
                <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-black text-gray-800 leading-tight">
                    {question}
                </h2>
            </div>
        </div>
    );
};

export default QuizCard;
