import { useEffect, useState } from "react";
import type { IPlayer, IResponsePlayer, IRoom } from "~/types/room.types";
import { Users, Trophy, Clock, User, Copy, CheckCircle2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socket } from "~/configs/socket";
import type { IClub } from "~/types/club.types";
import { Button } from "~/components/ui/button";
import CountDown from "~/components/CountDown";

const WaitPage = () => {
    const navigate = useNavigate();

    const [info, setInfo] = useState<{
        player: IPlayer;
        room: IRoom;
        club: IClub;
    } | null>(() => {
        const storedInfo = localStorage.getItem("player");
        const storedRoom = localStorage.getItem("room");
        const storedClub = localStorage.getItem("club");

        if (storedInfo && storedRoom && storedClub) {
            return {
                // **Lưu ý:** Vì bạn đã kiểm tra ở if (storedInfo && storedRoom && storedClub),
                // nên các biến này chắc chắn không phải null ở đây.
                player: JSON.parse(storedInfo),
                room: JSON.parse(storedRoom),
                club: JSON.parse(storedClub),
            };
        }

        // Trả về null khi không có dữ liệu
        return null;
    });

    const [players, setPlayers] = useState<IResponsePlayer[]>([]);
    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [waitingDots, setWaitingDots] = useState(".");
    const [copied, setCopied] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const roomCode = localStorage.getItem("roomCode") || "ROOM123"; // Mock data
    const handleLogout = () => {
        localStorage.removeItem("player");
        localStorage.removeItem("club");
        localStorage.removeItem("room");
        socket.disconnect();
        socket.connect();
        navigate("/");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setWaitingDots((prev) => (prev.length >= 3 ? "." : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on(`update_participants_${info?.club.id}`, (data) => {
            console.log("update_participants", data);
            setPlayers(data);
        });

        // Demo: Bắt đầu countdown sau 5 giây (thực tế sẽ lắng nghe event từ socket)
        socket.on("start_game", () => {
            setShowCountdown(true);
        });

        socket.emit("join_game", {
            roomCode: info?.room.code,
            fullName: info?.player.fullName,
            playerId: info?.player.id,
            clubId: info?.club.id,
        });
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off(`update_participants_${info?.club.id}`);
            socket.off("start_game");
        };
    }, []);

    if (!info) {
        navigate("/");
        return null;
    }

    return (
        <>
            <CountDown
                show={showCountdown}
                duration={5}
                redirectTo="/game"
                title="Trò chơi sắp bắt đầu!"
                onComplete={() => {
                    console.log("Countdown completed!");
                }}
            />

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

                {/* Main Content */}
                <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                    <div className="w-full max-w-5xl">
                        {/* Header Section */}
                        <div className="mb-6 animate-slide-in-up text-center">
                            <div className="mb-3 flex items-center justify-center gap-3">
                                <Clock className="h-8 w-8 animate-pulse text-white" />
                                <h1 className="text-4xl font-black text-white drop-shadow-lg">Phòng Chờ</h1>
                            </div>
                            <p className="text-lg font-semibold text-white/90">Đang chờ người chơi khác{waitingDots}</p>

                            {/* Room Code Display */}
                            <div className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 shadow-2xl">
                                <span className="text-sm font-bold text-gray-700">Mã phòng:</span>
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                    {info.room?.code}
                                </span>
                                <button
                                    onClick={handleCopyCode}
                                    className="rounded-full bg-purple-100 p-2 transition-all hover:scale-110 hover:bg-purple-200"
                                >
                                    {copied ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <Copy className="h-5 w-5 text-purple-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {/* Left Panel - Your Info */}
                            <div className="lg:col-span-1 animate-slide-in-left">
                                <div className="glass-effect-strong rounded-3xl p-6 shadow-2xl">
                                    <div className="mb-4 flex items-center justify-between border-b-2 border-gray-200 pb-3">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-6 w-6 text-purple-600" />
                                            <h2 className="text-lg font-black text-gray-800">Thông Tin Của Bạn</h2>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="icon-sm"
                                            onClick={handleLogout}
                                            className="transition-smooth hover:scale-110"
                                        >
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-4xl font-black text-white shadow-2xl ring-4 ring-white">
                                                {info.player?.fullName.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1 shadow-lg ring-4 ring-white">
                                                <div className="h-3 w-3 rounded-full bg-white"></div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="text-center w-full">
                                            <h3 className="text-xl font-black text-gray-800">
                                                {info.player?.fullName || "Unknown"}
                                            </h3>
                                            <p className="mt-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-bold text-purple-700">
                                                {info.club?.name || "No Club"}
                                            </p>
                                        </div>

                                        {/* Stats */}
                                        <div className="w-full space-y-3 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-600">Trạng thái:</span>
                                                {isConnected ? (
                                                    <span className="flex items-center gap-2 text-sm font-black text-green-600">
                                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                        Đã kết nối
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-sm font-black text-red-600">
                                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                        Mất kết nối
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-600">Điểm số:</span>
                                                <span className="text-sm font-black text-purple-600">
                                                    {info.player?.score || 0} 🏆
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Players List */}
                            <div className="lg:col-span-2 animate-slide-in-right">
                                <div className="glass-effect-strong rounded-3xl p-6 shadow-2xl">
                                    <div className="mb-4 flex items-center justify-between border-b-2 border-gray-200 pb-3">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-6 w-6 text-purple-600" />
                                            <h2 className="text-lg font-black text-gray-800">
                                                Thành viên khác trong CLB
                                            </h2>
                                        </div>
                                        <span className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-black text-purple-700">
                                            {Math.max(0, players.length - 1)} <User className="h-4 w-4" />
                                        </span>
                                    </div>

                                    {/* Players Grid */}
                                    <div className="max-h-96 overflow-y-auto pr-2">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {players.map((player, index) => {
                                                if (player.playerId === info.player.id) {
                                                    return null;
                                                }
                                                return (
                                                    <div
                                                        key={player.id}
                                                        className="group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 transition-all hover:scale-105 hover:shadow-lg"
                                                        style={{
                                                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {/* Player Avatar */}
                                                            <div className="flex-shrink-0">
                                                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-lg font-black text-white shadow-lg">
                                                                    {player.fullName?.charAt(0)?.toUpperCase() || "?"}
                                                                </div>
                                                            </div>

                                                            {/* Player Info */}
                                                            <div className="flex-1 overflow-hidden">
                                                                <h3 className="truncate text-base font-black text-gray-800">
                                                                    {player.fullName}
                                                                </h3>
                                                                <p className="text-xs font-semibold text-gray-600">
                                                                    Đã sẵn sàng ✓
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Loading Animation */}
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        <div
                                            className="h-3 w-3 animate-bounce rounded-full bg-purple-500"
                                            style={{ animationDelay: "0ms" }}
                                        ></div>
                                        <div
                                            className="h-3 w-3 animate-bounce rounded-full bg-pink-500"
                                            style={{ animationDelay: "150ms" }}
                                        ></div>
                                        <div
                                            className="h-3 w-3 animate-bounce rounded-full bg-yellow-500"
                                            style={{ animationDelay: "300ms" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="mt-6 text-center animate-pulse-slow">
                            <p className="text-base font-bold text-white drop-shadow-lg">
                                💡 Trò chơi sẽ bắt đầu khi chủ phòng nhấn nút bắt đầu
                            </p>
                        </div>
                    </div>
                </div>

                {/* CSS Animation */}
                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </>
    );
};

export default WaitPage;
