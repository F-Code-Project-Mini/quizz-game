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

            <div className="flex min-h-screen items-center justify-center bg-[url('https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455632.jpg?semt=ais_hybrid&w=740&q=80')] bg-cover bg-center p-2 sm:p-4">
                {/* Main Container */}
                <div className="relative z-10 w-full max-w-5xl">
                    {/* Header Section */}
                    <div className="mb-3 text-center sm:mb-6">
                        <div className="mb-2 flex items-center justify-center gap-2 sm:mb-3">
                            <Clock className="h-5 w-5 animate-pulse text-gray-800 sm:h-7 sm:w-7" />
                            <h1 className="text-2xl font-bold text-gray-800 sm:text-4xl">Phòng Chờ</h1>
                        </div>
                        <p className="text-sm font-medium text-gray-700 sm:text-lg">
                            Đang chờ người chơi khác{waitingDots}
                        </p>

                        {/* Room Code Display */}
                        <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-sm sm:mt-4 sm:gap-3 sm:px-4 sm:py-2">
                            <span className="text-xs font-semibold text-gray-700 sm:text-sm">Mã phòng:</span>
                            <span className="text-sm font-bold text-fuchsia-600 sm:text-lg">{info.room?.code}</span>
                            <button
                                onClick={handleCopyCode}
                                className="rounded-full bg-fuchsia-100 p-1 transition-all hover:bg-fuchsia-200 sm:p-1.5"
                            >
                                {copied ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-600 sm:h-4 sm:w-4" />
                                ) : (
                                    <Copy className="h-3 w-3 text-fuchsia-600 sm:h-4 sm:w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
                        {/* Left Panel - Your Info */}
                        <div className="lg:col-span-1">
                            <div className="rounded-xl bg-white p-3 shadow-2xl sm:rounded-2xl sm:p-4">
                                <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2 sm:mb-3">
                                    <div className="flex gap-2">
                                        <Trophy className="h-4 w-4 text-fuchsia-600 sm:h-5 sm:w-5" />
                                        <h2 className="text-sm font-bold text-gray-800 sm:text-base">
                                            Thông Tin Của Bạn
                                        </h2>
                                    </div>
                                    <Button variant="fuchsia" onClick={handleLogout}>
                                        <LogOut />
                                    </Button>
                                </div>

                                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                                    <div className="relative">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-2xl font-bold text-white shadow-lg ring-2 ring-white sm:h-24 sm:w-24 sm:text-4xl sm:ring-4">
                                            {info.player?.fullName.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        {/* {info.player?.role === "HOST" && (
                                            <div className="absolute -top-1 -right-1 rounded-full bg-yellow-400 p-1 shadow-lg ring-2 ring-white sm:p-1.5 sm:ring-4">
                                                <Crown className="h-3 w-3 text-yellow-900 sm:h-4 sm:w-4" />
                                            </div>
                                        )} */}
                                    </div>

                                    {/* Info */}
                                    <div className="text-center">
                                        <h3 className="text-base font-bold text-gray-800 sm:text-xl">
                                            {info.player?.fullName || "Unknown"}
                                        </h3>
                                        <p className="mt-1 rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-semibold text-fuchsia-700 sm:px-3 sm:py-1 sm:text-sm">
                                            {info.club?.name || "No Club"}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-2 w-full space-y-1.5 rounded-xl bg-gradient-to-br from-fuchsia-50 to-purple-50 p-2.5 sm:mt-3 sm:space-y-2 sm:rounded-2xl sm:p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-600 sm:text-sm">
                                                Trạng thái:
                                            </span>
                                            {isConnected ? (
                                                <span className="text-xs font-bold text-green-600 sm:text-sm">
                                                    Đã kết nối
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-red-600 sm:text-sm">
                                                    Mất kết nối
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-600 sm:text-sm">
                                                Điểm số:
                                            </span>
                                            <span className="text-xs font-bold text-purple-600 sm:text-sm">
                                                {info.player?.score || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Players List */}
                        <div className="lg:col-span-2">
                            <div className="rounded-xl bg-white p-3 shadow-2xl sm:rounded-2xl sm:p-4">
                                <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2 sm:mb-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-fuchsia-600 sm:h-5 sm:w-5" />
                                        <h2 className="text-sm font-bold text-gray-800 sm:text-base">
                                            Thành viên khác trong CLB
                                        </h2>
                                    </div>
                                    <span className="flex items-center gap-1 rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-bold text-fuchsia-700 sm:px-3 sm:py-1 sm:text-sm">
                                        {Math.max(0, players.length - 1)} <User size={13} />
                                    </span>
                                </div>

                                {/* Players Grid */}
                                <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                                    {players.map((player, index) => {
                                        console.log(player, info.player);

                                        if (player.playerId === info.player.id) {
                                            return null;
                                        }
                                        return (
                                            <div
                                                key={player.id}
                                                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-fuchsia-50 to-purple-50 p-2.5 transition-all hover:shadow-md sm:rounded-2xl sm:p-3"
                                                style={{
                                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                                                }}
                                            >
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    {/* Player Avatar */}
                                                    <div className="relative flex-shrink-0">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-500 text-sm font-bold text-white shadow-md sm:h-12 sm:w-12 sm:text-base">
                                                            {player.fullName?.charAt(0)?.toUpperCase() || "?"}
                                                        </div>
                                                        {/* {player.role === "HOST" && (
                                                        <div className="absolute -top-0.5 -right-0.5 rounded-full bg-yellow-400 p-0.5 shadow-md sm:p-1">
                                                            <Crown className="h-2 w-2 text-yellow-900 sm:h-2.5 sm:w-2.5" />
                                                        </div>
                                                    )} */}
                                                    </div>

                                                    {/* Player Info */}
                                                    <div className="flex-1 overflow-hidden">
                                                        <h3 className="truncate text-sm font-bold text-gray-800 sm:text-base">
                                                            {player.fullName}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Loading Animation */}
                                <div className="mt-3 flex items-center justify-center gap-1.5 sm:mt-4 sm:gap-2">
                                    <div
                                        className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-500 sm:h-2.5 sm:w-2.5"
                                        style={{ animationDelay: "0ms" }}
                                    ></div>
                                    <div
                                        className="h-2 w-2 animate-bounce rounded-full bg-purple-500 sm:h-2.5 sm:w-2.5"
                                        style={{ animationDelay: "150ms" }}
                                    ></div>
                                    <div
                                        className="h-2 w-2 animate-bounce rounded-full bg-pink-500 sm:h-2.5 sm:w-2.5"
                                        style={{ animationDelay: "300ms" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="mt-3 text-center sm:mt-4">
                        <p className="text-xs font-medium text-gray-700 sm:text-sm">
                            💡 Trò chơi sẽ bắt đầu khi chủ phòng nhấn nút bắt đầu
                        </p>
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
