import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Trophy, Clock, Users } from "lucide-react";
import { socket } from "~/configs/socket";
import publicApi from "~/lib/axios-instance";
import type { IRoom } from "~/types/room.types";

interface GameState {
    currentQuestionIndex: number;
    questionStartedAt: string;
    totalQuestions: number;
    isActive: boolean;
}

interface Player {
    id: string;
    fullName: string;
    score: number;
    club: {
        name: string;
    };
}

const HostView = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState<IRoom | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        loadRoomData();

        socket.on("game_started", (data) => {
            setGameState({
                currentQuestionIndex: data.currentQuestionIndex,
                questionStartedAt: new Date().toISOString(),
                totalQuestions: data.totalQuestions,
                isActive: true,
            });
            setShowLeaderboard(false);
        });

        socket.on("next_question", (data) => {
            setGameState({
                currentQuestionIndex: data.currentQuestionIndex,
                questionStartedAt: new Date().toISOString(),
                totalQuestions: data.totalQuestions,
                isActive: true,
            });
            setShowLeaderboard(false);
            loadRoomData();
        });

        socket.on("game_ended", (data) => {
            setPlayers(data.leaderboard);
            setShowLeaderboard(true);
        });

        socket.on("player_answered", (data) => {
            setPlayers((prev) => prev.map((p) => (p.id === data.playerId ? { ...p, score: data.score } : p)));
        });

        return () => {
            socket.off("game_started");
            socket.off("next_question");
            socket.off("game_ended");
            socket.off("player_answered");
        };
    }, [roomId]);

    useEffect(() => {
        if (!gameState || !gameState.isActive) return;

        const currentQuestion = room?.questions?.[gameState.currentQuestionIndex];
        if (!currentQuestion) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const started = new Date(gameState.questionStartedAt).getTime();
            const elapsed = Math.floor((now - started) / 1000);
            return Math.max(0, currentQuestion.timeQuestion - elapsed);
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (newTimeLeft === 0) {
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [gameState, room]);

    const loadRoomData = async () => {
        try {
            const response = await publicApi.get(`/room/${roomId}/state`);
            if (response.data.success) {
                setRoom(response.data.result.room);
                setGameState(response.data.result.gameState);
                setPlayers(response.data.result.room.players || []);

                if (response.data.result.gameState) {
                    socket.emit("join_game", {
                        roomCode: response.data.result.room.code,
                        fullName: "Host",
                        playerId: "host",
                        clubId: "host",
                    });
                }
            }
        } catch (error) {
            console.error("Error loading room data:", error);
        }
    };

    if (!room) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-game">
                <div className="text-center text-white">
                    <div className="mb-4 text-2xl font-bold">Đang tải...</div>
                </div>
            </div>
        );
    }

    if (showLeaderboard || room.status === "FINISHED") {
        return (
            <div className="min-h-screen bg-gradient-game p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 text-center animate-scale-in">
                        <Trophy className="mx-auto mb-4 h-24 w-24 text-yellow-400 animate-bounce" />
                        <h1 className="text-5xl font-black text-white drop-shadow-lg">Bảng xếp hạng</h1>
                        <p className="mt-2 text-2xl text-white/90">{room.name}</p>
                    </div>

                    <div className="space-y-4">
                        {players.slice(0, 10).map((player, idx) => (
                            <div
                                key={player.id}
                                className={`flex items-center justify-between rounded-2xl p-6 shadow-2xl animate-slide-in-up ${
                                    idx === 0
                                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                        : idx === 1
                                          ? "bg-gradient-to-r from-gray-300 to-gray-400"
                                          : idx === 2
                                            ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                            : "bg-white"
                                }`}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-center gap-6">
                                    <div
                                        className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl font-black ${
                                            idx < 3
                                                ? "bg-white text-gray-800"
                                                : "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                                        }`}
                                    >
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p
                                            className={`text-2xl font-black ${idx < 3 ? "text-white" : "text-gray-800"}`}
                                        >
                                            {player.fullName}
                                        </p>
                                        <p className={`text-lg ${idx < 3 ? "text-white/90" : "text-gray-600"}`}>
                                            {player.club.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-4xl font-black ${idx < 3 ? "text-white" : "text-purple-600"}`}>
                                        {player.score}
                                    </p>
                                    <p className={`text-lg ${idx < 3 ? "text-white/90" : "text-gray-600"}`}>điểm</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (room.status === "WAITING") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-game p-8">
                <div className="text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="rounded-3xl bg-white p-6 shadow-2xl animate-pulse">
                            <img src="/logo.svg" alt="Logo" className="h-32 w-32" />
                        </div>
                    </div>
                    <h1 className="mb-4 text-6xl font-black text-white drop-shadow-lg">{room.name}</h1>
                    <p className="mb-8 text-3xl font-semibold text-white/90">Mã phòng: {room.code}</p>
                    <div className="mb-8 flex items-center justify-center gap-4">
                        <Users className="h-12 w-12 text-white" />
                        <span className="text-4xl font-black text-white">{players.length} người chơi</span>
                    </div>
                    <p className="text-2xl text-white/80 animate-pulse">Đang chờ bắt đầu...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = room.questions?.[gameState?.currentQuestionIndex || 0];

    if (!currentQuestion) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-game">
                <p className="text-2xl text-white">Không có câu hỏi</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-game p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="rounded-2xl bg-white px-6 py-3 shadow-lg">
                        <p className="text-xl font-bold text-gray-700">
                            Câu {(gameState?.currentQuestionIndex || 0) + 1}/{room.questions?.length || 0}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-3 shadow-lg">
                        <Clock className="h-8 w-8 text-purple-600" />
                        <span
                            className={`text-3xl font-black ${timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-gray-800"}`}
                        >
                            {timeLeft}s
                        </span>
                    </div>
                </div>

                <div className="mb-8 rounded-3xl bg-white p-8 shadow-2xl">
                    <h2 className="text-4xl font-black text-gray-800">{currentQuestion.question}</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {currentQuestion.answers?.map((answer: any, idx: number) => (
                        <div
                            key={answer.id}
                            className={`rounded-2xl p-6 shadow-xl transition-transform hover:scale-105 ${
                                answer.isCorrect
                                    ? "bg-gradient-to-br from-green-500 to-green-600"
                                    : idx === 0
                                      ? "bg-gradient-to-br from-red-500 to-red-600"
                                      : idx === 1
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                        : idx === 2
                                          ? "bg-gradient-to-br from-yellow-500 to-yellow-600"
                                          : "bg-gradient-to-br from-purple-500 to-purple-600"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-white/30 text-3xl font-black text-white">
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <p className="text-2xl font-bold text-white">{answer.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-purple-600" />
                        <h3 className="text-xl font-black text-gray-800">Top 5</h3>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-5">
                        {players
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5)
                            .map((player, idx) => (
                                <div
                                    key={player.id}
                                    className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-3 text-center"
                                >
                                    <p className="text-lg font-bold text-gray-800 truncate">{player.fullName}</p>
                                    <p className="text-2xl font-black text-purple-600">{player.score}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostView;
