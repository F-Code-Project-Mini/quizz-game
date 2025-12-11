import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayCircle, SkipForward, StopCircle, Users, MonitorPlay, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { socket } from "~/configs/socket";
import privateApi from "~/lib/private-api";
import Swal from "sweetalert2";
import GameCountdown from "~/components/GameCountdown";
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
        id: string;
        name: string;
    };
}

const RoomManagement = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState<IRoom | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCountdown, setShowCountdown] = useState(false);

    useEffect(() => {
        loadRoomData();

        socket.on("player_answered", (data) => {
            setPlayers((prev) => prev.map((p) => (p.id === data.playerId ? { ...p, score: data.score } : p)));
        });

        return () => {
            socket.off("player_answered");
        };
    }, [roomId]);

    const loadRoomData = async () => {
        try {
            const response = await privateApi.get(`/room/${roomId}/state`);
            if (response.data.success) {
                setRoom(response.data.result.room);
                setGameState(response.data.result.gameState);
                setPlayers(response.data.result.room.players || []);
            }
        } catch (error) {
            Swal.fire({
                title: "Lỗi",
                text: "Không thể tải thông tin phòng",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStartGame = async () => {
        if (!room || !room.questions || room.questions.length === 0) {
            Swal.fire({
                title: "Lỗi",
                text: "Phòng chưa có câu hỏi nào",
                icon: "error",
            });
            return;
        }

        setShowCountdown(true);
    };

    const handleCountdownComplete = async () => {
        try {
            const response = await privateApi.post(`/room/${roomId}/start`);
            if (response.data.success) {
                socket.emit("start_game", { roomCode: room?.code });
                await loadRoomData();
            }
        } catch (error: any) {
            Swal.fire({
                title: "Lỗi",
                text: error.response?.data?.message || "Không thể bắt đầu trò chơi",
                icon: "error",
            });
        }
    };

    const handleNextQuestion = async () => {
        try {
            const response = await privateApi.post(`/room/${roomId}/next`);
            if (response.data.success) {
                socket.emit("next_question", { roomCode: room?.code });
                await loadRoomData();
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
                    socket.emit("next_question", { roomCode: room?.code });
                    await loadRoomData();
                    Swal.fire({
                        title: "Thành công",
                        text: "Trò chơi đã kết thúc!",
                        icon: "success",
                    });
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

    const handleOpenHostView = () => {
        window.open(`/host/${roomId}`, "_blank", "width=1920,height=1080");
    };

    if (loading) {
        return <div className="py-12 text-center">Đang tải...</div>;
    }

    if (!room) {
        return <div className="py-12 text-center">Không tìm thấy phòng</div>;
    }

    const currentQuestion = room.questions?.[gameState?.currentQuestionIndex || 0];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">{room.name}</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Mã phòng:{" "}
                        <code className="rounded bg-purple-100 px-2 py-1 font-bold text-purple-700">{room.code}</code>
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-md border">
                        <h2 className="mb-4 text-lg font-black text-gray-800">Điều khiển trò chơi</h2>
                        <div className="flex flex-wrap gap-3">
                            {room.status === "WAITING" && (
                                <Button
                                    onClick={handleStartGame}
                                    className="bg-gradient-to-r from-green-600 to-green-700"
                                    disabled={!room.questions || room.questions.length === 0}
                                >
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    Bắt đầu trò chơi
                                </Button>
                            )}
                            {room.status === "IN_PROGRESS" && (
                                <>
                                    <Button
                                        onClick={handleNextQuestion}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700"
                                    >
                                        <SkipForward className="mr-2 h-5 w-5" />
                                        Câu tiếp theo
                                    </Button>
                                    <Button
                                        onClick={handleEndGame}
                                        className="bg-gradient-to-r from-red-600 to-red-700"
                                    >
                                        <StopCircle className="mr-2 h-5 w-5" />
                                        Kết thúc
                                    </Button>
                                </>
                            )}
                            <Button onClick={handleOpenHostView} variant="outline">
                                <MonitorPlay className="mr-2 h-5 w-5" />
                                Mở màn hình chiếu
                            </Button>
                        </div>
                    </div>

                    {room.status === "IN_PROGRESS" && currentQuestion && (
                        <div className="rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white shadow-lg">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-black">
                                    Câu {(gameState?.currentQuestionIndex || 0) + 1}/{room.questions?.length || 0}
                                </h3>
                                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
                                    {currentQuestion.timeQuestion}s
                                </span>
                            </div>
                            <p className="text-lg font-semibold">{currentQuestion.question}</p>
                            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                {currentQuestion.answers?.map((answer: any, idx: number) => (
                                    <div
                                        key={answer.id}
                                        className={`rounded-lg p-3 ${
                                            answer.isCorrect ? "bg-green-500" : "bg-white/20"
                                        }`}
                                    >
                                        <span className="font-bold">
                                            {String.fromCharCode(65 + idx)}. {answer.answer}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="rounded-xl bg-white p-6 shadow-md border">
                    <div className="mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <h2 className="text-lg font-black text-gray-800">Người chơi ({players.length})</h2>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {players
                            .sort((a, b) => b.score - a.score)
                            .map((player, idx) => (
                                <div
                                    key={player.id}
                                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-sm font-black text-white">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{player.fullName}</p>
                                            <p className="text-xs text-gray-500">{player.club.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-purple-600">{player.score}</p>
                                        <p className="text-xs text-gray-500">điểm</p>
                                    </div>
                                </div>
                            ))}
                        {players.length === 0 && (
                            <p className="py-8 text-center text-sm text-gray-500">Chưa có người chơi nào</p>
                        )}
                    </div>
                </div>
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
};

export default RoomManagement;
