import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Trophy, Clock, Users, PlayCircle } from "lucide-react";
import { socket } from "~/configs/socket";
import privateApi from "~/lib/private-api";
import publicApi from "~/lib/axios-instance";
import type { IRoom } from "~/types/room.types";
import GameCountdown from "~/components/GameCountdown";
import GameLeaderboard from "~/components/GameLeaderboard";
import Swal from "sweetalert2";

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
        id: string;
        name: string;
    };
}

const HostView = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState<IRoom | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [onlinePlayerCount, setOnlinePlayerCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);

    useEffect(() => {
        loadRoomData();

        socket.on("start_countdown", () => {
            setShowCountdown(true);
        });

        socket.on("game_started", (data) => {
            setShowCountdown(false);
            setGameState({
                currentQuestionIndex: data.currentQuestionIndex,
                questionStartedAt: data.questionStartedAt,
                totalQuestions: data.totalQuestions,
                isActive: true,
            });
            setShowLeaderboard(false);
        });

        socket.on("next_question", (data) => {
            setGameState({
                currentQuestionIndex: data.currentQuestionIndex,
                questionStartedAt: data.questionStartedAt,
                totalQuestions: data.totalQuestions,
                isActive: true,
            });
            setShowLeaderboard(false);
            loadRoomData();
        });

        socket.on("show_leaderboard", (data) => {
            setPlayers(data.leaderboard);
            setShowLeaderboard(true);
        });

        socket.on("game_ended", (data) => {
            setPlayers(data.leaderboard);
            setShowLeaderboard(true);
            setGameState((prev) => (prev ? { ...prev, isActive: false } : null));
        });

        socket.on("player_answered", (data) => {
            setPlayers((prev) => prev.map((p) => (p.id === data.playerId ? { ...p, score: data.score } : p)));
        });

        socket.on("player_joined", (data) => {
            setOnlinePlayerCount(data.count);
        });

        socket.on("player_left", (data) => {
            setOnlinePlayerCount(data.count);
        });

        // Host joins room to enable real-time features
        const joinAsHost = async () => {
            const roomData = await loadRoomData();
            if (roomData?.code) {
                socket.emit("host_join", { roomCode: roomData.code });
            }
        };
        joinAsHost();

        // Cleanup: notify backend when host leaves
        return () => {
            if (room?.code) {
                socket.emit("host_leave", { roomCode: room.code });
            }
            socket.off("start_countdown");
            socket.off("game_started");
            socket.off("next_question");
            socket.off("show_leaderboard");
            socket.off("game_ended");
            socket.off("player_answered");
            socket.off("player_joined");
            socket.off("player_left");
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
                // Show answer feedback (highlight correct answer)
                setShowAnswerFeedback(true);
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
                return response.data.result.room;
            }
        } catch (error) {
            console.error("Error loading room data:", error);
        }
        return null;
    };

    const loadLeaderboard = async () => {
        try {
            const response = await publicApi.get(`/room/${roomId}/leaderboard`);
            if (response.data.success) {
                setPlayers(response.data.result);
                setShowLeaderboard(true);
                socket.emit("show_leaderboard", {
                    roomCode: room?.code,
                    leaderboard: response.data.result,
                });
            }
        } catch (error) {
            console.error("Error loading leaderboard:", error);
        }
    };

    const handleStartGame = () => {
        if (!room || !room.questions || room.questions.length === 0) {
            Swal.fire({
                title: "Lỗi",
                text: "Phòng chưa có câu hỏi nào",
                icon: "error",
            });
            return;
        }

        // Just emit start event, backend will handle countdown
        socket.emit("start_game", { roomCode: room?.code });
    };

    const handleCountdownComplete = async () => {
        // Backend already started the game, just update local state
        try {
            await loadRoomData();
        } catch (error: any) {
            Swal.fire({
                title: "Lỗi",
                text: error.response?.data?.message || "Không thể bắt đầu trò chơi",
                icon: "error",
            });
        }
    };

    const handleNextQuestion = async () => {
        // If showing answer feedback, load leaderboard first
        if (showAnswerFeedback) {
            setShowAnswerFeedback(false);
            await loadLeaderboard();
            return;
        }

        // Otherwise, proceed to next question
        try {
            const response = await privateApi.post(`/room/${roomId}/next`);
            if (response.data.success) {
                socket.emit("next_question", { roomCode: room?.code });
                await loadRoomData();
                setShowLeaderboard(false);
            }
        } catch (error: any) {
            if (error.response?.data?.message === "Đã hết câu hỏi") {
                Swal.fire({
                    title: "Kết thúc",
                    text: "Đã hết câu hỏi. Vui lòng kết thúc trò chơi.",
                    icon: "info",
                });
            } else {
                Swal.fire({
                    title: "Lỗi",
                    text: error.response?.data?.message || "Không thể chuyển câu hỏi",
                    icon: "error",
                });
            }
        }
    };

    const handleEndGame = async () => {
        const result = await Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc muốn kết thúc trò chơi?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Kết thúc",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                const response = await privateApi.post(`/room/${roomId}/end`);
                if (response.data.success) {
                    socket.emit("game_ended", {
                        roomCode: room?.code,
                        leaderboard: players,
                    });
                    await loadLeaderboard();
                }
            } catch (error: any) {
                Swal.fire({
                    title: "Lỗi",
                    text: error.response?.data?.message || "Không thể kết thúc trò chơi",
                    icon: "error",
                });
            }
        }
    };

    const handleResetGame = async () => {
        const result = await Swal.fire({
            title: "Reset trò chơi",
            text: "Bạn có chắc muốn reset và chơi lại?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Reset",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                const response = await privateApi.post(`/room/${roomId}/reset`);
                if (response.data.success) {
                    Swal.fire({
                        title: "Thành công",
                        text: "Phòng đã được reset, có thể chơi lại",
                        icon: "success",
                    });
                    await loadRoomData();
                    setShowLeaderboard(false);
                    setGameState(null);
                }
            } catch (error: any) {
                Swal.fire({
                    title: "Lỗi",
                    text: error.response?.data?.message || "Không thể reset trò chơi",
                    icon: "error",
                });
            }
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

    // Show leaderboard
    if (showLeaderboard) {
        return (
            <GameLeaderboard
                players={players}
                currentQuestion={(gameState?.currentQuestionIndex || 0) + 1}
                totalQuestions={room.questions?.length || 0}
                onNext={handleNextQuestion}
                onEnd={handleEndGame}
                onReset={room?.status === "FINISHED" ? handleResetGame : undefined}
                isHost={true}
            />
        );
    }

    // Waiting room
    if (room.status === "WAITING") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-game p-8">
                <div className="text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="animate-pulse rounded-3xl bg-white p-6 shadow-2xl">
                            <Trophy className="h-32 w-32 text-purple-600" />
                        </div>
                    </div>
                    <h1 className="mb-4 text-6xl font-black text-white drop-shadow-lg">{room.name}</h1>
                    <p className="mb-8 text-3xl font-semibold text-white/90">Mã phòng: {room.code}</p>
                    <div className="mb-8 flex items-center justify-center gap-4">
                        <Users className="h-12 w-12 text-white" />
                        <span className="text-4xl font-black text-white">{onlinePlayerCount} người chơi</span>
                    </div>

                    <button
                        onClick={handleStartGame}
                        disabled={!room.questions || room.questions.length === 0}
                        className="rounded-2xl bg-gradient-to-r from-green-500 to-green-700 px-12 py-6 text-3xl font-black text-white shadow-2xl transition-all hover:scale-105 disabled:opacity-50"
                    >
                        <PlayCircle className="mr-3 inline-block h-10 w-10" />
                        Bắt đầu trò chơi
                    </button>
                </div>

                {showCountdown && (
                    <GameCountdown
                        onComplete={() => {
                            setShowCountdown(false);
                            handleCountdownComplete();
                        }}
                    />
                )}
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

    // Question display
    return (
        <div className="min-h-screen bg-gradient-game p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <div className="rounded-2xl bg-white px-6 py-3 shadow-lg">
                        <p className="text-xl font-bold text-gray-700">
                            Câu {(gameState?.currentQuestionIndex || 0) + 1}/{room.questions?.length || 0}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-3 shadow-lg">
                            <Clock className="h-8 w-8 text-purple-600" />
                            <span
                                className={`text-3xl font-black ${
                                    timeLeft <= currentQuestion.timeQuestion / 4
                                        ? "animate-pulse text-red-600"
                                        : "text-gray-800"
                                }`}
                            >
                                {timeLeft}s
                            </span>
                        </div>
                        <button
                            onClick={loadLeaderboard}
                            className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105"
                        >
                            <Trophy className="inline h-6 w-6" /> Xem BXH
                        </button>
                    </div>
                </div>

                <div className="mb-8 rounded-3xl bg-white p-8 shadow-2xl">
                    <h2 className="text-4xl font-black text-gray-800">{currentQuestion.question}</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {currentQuestion.answers?.map((answer: any, idx: number) => (
                        <div
                            key={answer.id}
                            className={`rounded-2xl p-6 shadow-xl transition-all ${
                                showAnswerFeedback && answer.isCorrect
                                    ? "scale-110 ring-8 ring-yellow-400 animate-pulse bg-gradient-to-br from-green-500 to-green-600"
                                    : answer.isCorrect
                                      ? "bg-gradient-to-br from-green-500 to-green-600"
                                      : idx === 0
                                        ? "bg-gradient-to-br from-red-500 to-red-600"
                                        : idx === 1
                                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                          : idx === 2
                                            ? "bg-gradient-to-br from-yellow-500 to-yellow-600"
                                            : "bg-gradient-to-br from-purple-500 to-purple-600"
                            } ${showAnswerFeedback && !answer.isCorrect ? "opacity-50" : ""}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/30 text-3xl font-black text-white">
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <p className="text-2xl font-bold text-white">{answer.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show Next button when answer feedback is displayed */}
                {showAnswerFeedback && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleNextQuestion}
                            className="rounded-2xl bg-gradient-to-r from-green-500 to-green-700 px-12 py-6 text-3xl font-black text-white shadow-2xl transition-all hover:scale-105 animate-bounce"
                        >
                            Tiếp theo →
                        </button>
                    </div>
                )}

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-purple-600" />
                        <h3 className="text-xl font-black text-gray-800">Top 5</h3>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-5">
                        {players
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5)
                            .map((player) => (
                                <div
                                    key={player.id}
                                    className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-3 text-center"
                                >
                                    <p className="truncate text-lg font-bold text-gray-800">{player.fullName}</p>
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
