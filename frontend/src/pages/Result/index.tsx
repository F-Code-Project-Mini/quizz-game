import { Trophy, Star, TrendingUp, Home, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ResultPageProps {
    score?: number;
    correctAnswers?: number;
    totalQuestions?: number;
    rank?: number;
    totalPlayers?: number;
}

const ResultPage = ({
    score = 8500,
    correctAnswers = 8,
    totalQuestions = 10,
    rank = 1,
    totalPlayers = 15,
}: ResultPageProps) => {
    const navigate = useNavigate();
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    const getMedal = () => {
        if (rank === 1) return { emoji: "🥇", color: "text-yellow-400", label: "Hạng Nhất" };
        if (rank === 2) return { emoji: "🥈", color: "text-gray-400", label: "Hạng Nhì" };
        if (rank === 3) return { emoji: "🥉", color: "text-orange-400", label: "Hạng Ba" };
        return { emoji: "🏅", color: "text-blue-400", label: `Hạng ${rank}` };
    };

    const medal = getMedal();

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

            {/* Confetti Effect */}
            {rank <= 3 && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                            }}
                        >
                            {["🎉", "⭐", "🎊", "✨", "🏆"][Math.floor(Math.random() * 5)]}
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-2xl animate-scale-in">
                    {/* Medal & Rank */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 text-9xl animate-bounce">{medal.emoji}</div>
                        <h1 className={`mb-2 text-5xl font-black drop-shadow-lg ${medal.color}`}>{medal.label}</h1>
                        <p className="text-2xl font-bold text-white">
                            {rank} / {totalPlayers} người chơi
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="glass-effect-strong mb-6 rounded-3xl p-8 shadow-2xl">
                        {/* Score */}
                        <div className="mb-6 text-center">
                            <div className="mb-2 flex items-center justify-center gap-3">
                                <Trophy className="h-10 w-10 text-yellow-500" />
                                <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                    {score.toLocaleString()}
                                </p>
                            </div>
                            <p className="text-lg font-bold text-gray-600">Tổng điểm</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {/* Correct Answers */}
                            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 text-center">
                                <div className="mb-2 flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg">
                                        <Star className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-3xl font-black text-green-600">{correctAnswers}</p>
                                <p className="text-sm font-bold text-gray-600">Câu đúng</p>
                            </div>

                            {/* Accuracy */}
                            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center">
                                <div className="mb-2 flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-3xl font-black text-blue-600">{accuracy}%</p>
                                <p className="text-sm font-bold text-gray-600">Độ chính xác</p>
                            </div>

                            {/* Total Questions */}
                            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 text-center">
                                <div className="mb-2 flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 shadow-lg">
                                        <Trophy className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-3xl font-black text-purple-600">{totalQuestions}</p>
                                <p className="text-sm font-bold text-gray-600">Tổng câu hỏi</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            size="lg"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold shadow-glow-pink transition-smooth hover:scale-105 hover:from-purple-700 hover:to-pink-700"
                            onClick={() => navigate("/")}
                        >
                            <Home className="h-5 w-5" />
                            Về trang chủ
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 border-2 border-white bg-white/20 text-lg font-bold text-white backdrop-blur-sm transition-smooth hover:scale-105 hover:bg-white/30"
                            onClick={() => window.location.reload()}
                        >
                            <RotateCcw className="h-5 w-5" />
                            Chơi lại
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
