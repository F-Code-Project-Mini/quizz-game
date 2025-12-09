import { Trophy, Star, Medal } from "lucide-react";

interface ScoreBoardProps {
    score: number;
    streak?: number;
    correctAnswers?: number;
    totalQuestions?: number;
}

const ScoreBoard = ({ score, streak = 0, correctAnswers = 0, totalQuestions = 10 }: ScoreBoardProps) => {
    return (
        <div className="glass-effect-strong fixed left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 top-4 z-40 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl animate-slide-in-right">
            <div className="space-y-2 sm:space-y-3">
                {/* Score */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                        <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-600">Điểm số</p>
                        <p className="text-lg sm:text-2xl font-black text-yellow-600">{score}</p>
                    </div>
                </div>

                {/* Streak */}
                {streak > 0 && (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg">
                            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-600">Chuỗi đúng</p>
                            <p className="text-lg sm:text-2xl font-black text-purple-600">{streak} 🔥</p>
                        </div>
                    </div>
                )}

                {/* Progress */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg">
                        <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-600">Tiến độ</p>
                        <p className="text-base sm:text-lg font-black text-blue-600">
                            {correctAnswers}/{totalQuestions}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreBoard;
