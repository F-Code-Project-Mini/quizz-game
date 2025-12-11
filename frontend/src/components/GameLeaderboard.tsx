import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Award, Crown } from "lucide-react";

interface LeaderboardPlayer {
    id: string;
    fullName: string;
    score: number;
    club: {
        id: string;
        name: string;
    };
    rank?: number;
}

interface GameLeaderboardProps {
    players: LeaderboardPlayer[];
    currentQuestion?: number;
    totalQuestions?: number;
    onNext?: () => void;
    onEnd?: () => void;
    isHost?: boolean;
}

const GameLeaderboard = ({
    players,
    currentQuestion,
    totalQuestions,
    onNext,
    onEnd,
    isHost = false,
}: GameLeaderboardProps) => {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-8 w-8 text-yellow-400" />;
            case 2:
                return <Medal className="h-7 w-7 text-gray-400" />;
            case 3:
                return <Award className="h-6 w-6 text-orange-600" />;
            default:
                return null;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return "from-yellow-400 to-yellow-600";
            case 2:
                return "from-gray-300 to-gray-500";
            case 3:
                return "from-orange-400 to-orange-600";
            default:
                return "from-purple-500 to-pink-600";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-4"
        >
            <div className="w-full max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 text-center"
                >
                    <div className="mb-4 flex items-center justify-center gap-3">
                        <Trophy className="h-12 w-12 text-yellow-400" />
                        <h1 className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-5xl font-black text-transparent">
                            BẢNG XẾP HẠNG
                        </h1>
                        <Trophy className="h-12 w-12 text-yellow-400" />
                    </div>
                    {currentQuestion && totalQuestions && (
                        <p className="text-xl font-bold text-white">
                            Câu {currentQuestion}/{totalQuestions}
                        </p>
                    )}
                </motion.div>

                {/* Leaderboard */}
                <div className="mb-6 max-h-[60vh] space-y-3 overflow-y-auto rounded-2xl bg-white/10 p-6 backdrop-blur-lg">
                    <AnimatePresence>
                        {sortedPlayers.map((player, index) => (
                            <motion.div
                                key={player.id}
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center gap-4 rounded-xl bg-gradient-to-r ${getRankColor(index + 1)} p-4 shadow-lg transition-all hover:scale-105`}
                            >
                                {/* Rank */}
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center">
                                    {getRankIcon(index + 1) || (
                                        <span className="text-3xl font-black text-white">{index + 1}</span>
                                    )}
                                </div>

                                {/* Player Info */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-white">{player.fullName}</h3>
                                    <p className="text-sm font-semibold text-white/80">{player.club.name}</p>
                                </div>

                                {/* Score */}
                                <div className="text-right">
                                    <p className="text-4xl font-black text-white">{player.score}</p>
                                    <p className="text-xs font-bold text-white/80">điểm</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Host Controls */}
                {isHost && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center gap-4"
                    >
                        {onNext && currentQuestion && totalQuestions && currentQuestion < totalQuestions && (
                            <button
                                onClick={onNext}
                                className="rounded-xl bg-gradient-to-r from-green-500 to-green-700 px-8 py-4 text-xl font-black text-white shadow-xl transition-all hover:scale-105"
                            >
                                Câu tiếp theo
                            </button>
                        )}
                        {onEnd && (
                            <button
                                onClick={onEnd}
                                className="rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-8 py-4 text-xl font-black text-white shadow-xl transition-all hover:scale-105"
                            >
                                Kết thúc
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default GameLeaderboard;
