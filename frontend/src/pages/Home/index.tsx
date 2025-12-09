import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Swal from "sweetalert2";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { useEffect, useState } from "react";
import Room from "~/requests/room.requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { IRequestCheckRoom, IRoom } from "~/types/room.types";
import { LogIn, Play } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { socket } from "~/configs/socket";
interface IInput {
    roomCode: string;
    fullName: string;
    clubId: string;
}
const HomePage = () => {
    const navigate = useNavigate();
    const [infoRoom, setInfoRoom] = useState<IRoom>();
    const [isValidRoom, setIsValidRoom] = useState<boolean>(false);
    const [value, setValues] = useState({
        roomCode: "",
        fullName: "",
        clubId: "",
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setValues((prevValues) => ({ ...prevValues, [id]: value }));
    };

    const checkRoomMutation = useMutation({
        mutationFn: async (roomCode: string) => {
            const result = await Room.getRoom(roomCode);
            return result.data;
        },
        onSuccess: (data: IRequestCheckRoom) => {
            setInfoRoom(data.result);
            setIsValidRoom(true);
        },
        onError: (data) => {
            setIsValidRoom(false);
            if (axios.isAxiosError(data)) {
                Swal.fire({
                    title: "Failed",
                    text: "" + (data.response?.data.message || "Error occurred while checking the room."),
                    icon: "error",
                });
            }
        },
    });
    const checkJoinGameMutation = useMutation({
        mutationFn: async (payload: IInput) => {
            const result = await Room.joinRoom(payload);
            return result.data;
        },
        onSuccess: (data) => {
            console.log(data);
            localStorage.setItem("player", JSON.stringify(data.result.joinRoom));
            localStorage.setItem("club", JSON.stringify(data.result.club));
            localStorage.setItem("room", JSON.stringify(data.result.room));
            socket.emit("join_game", {
                roomCode: data.result.room.code,
                fullName: data.result.joinRoom.fullName,
                playerId: data.result.joinRoom.id,
                clubId: data.result.club.id,
            });

            Swal.fire({
                title: "Success",
                text: "Tham gia vào trò chơi thành công!",
                icon: "success",
            });
            navigate("/wait");
        },
        onError: (data) => {
            if (axios.isAxiosError(data)) {
                Swal.fire({
                    title: "Failed",
                    text: "" + (data.response?.data.message || "Error occurred while checking the room."),
                    icon: "error",
                });
            }
        },
    });
    const handleCheckRoom = (roomCode: string) => {
        checkRoomMutation.mutate(roomCode);
    };
    const handleJoinRoom = (payload: IInput) => {
        checkJoinGameMutation.mutate(payload);
    };
    useEffect(() => {
        if (localStorage.getItem("player") && localStorage.getItem("club") && localStorage.getItem("room")) {
            navigate("/wait");
        }
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-game">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
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

            {/* Content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
                {/* Logo & Title */}
                <div className="mb-8 animate-scale-in text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-3xl bg-white p-4 shadow-2xl">
                            <img src="/logo.svg" alt="Logo" className="h-20 w-20" />
                        </div>
                    </div>
                    <h1 className="mb-2 text-5xl font-black text-white drop-shadow-lg">Quiz Game</h1>
                    <p className="text-xl font-semibold text-white/90">🎮 Chơi và học cùng bạn bè!</p>
                </div>

                {/* Main Card */}
                <div className="mx-auto w-full max-w-lg animate-slide-in-up">
                    <div className="glass-effect-strong rounded-3xl p-8 shadow-2xl">
                        <JoinRoomForm payload={{ value, infoRoom, setValues, handleInputChange, handleCheckRoom }} />
                        {isValidRoom && (
                            <InputInfoUser payload={{ value, setValues, handleInputChange, handleJoinRoom }} />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-white/80">💡 Nhập mã phòng để tham gia trò chơi</p>
                </div>
            </div>
        </div>
    );
};

const JoinRoomForm = ({
    payload,
}: {
    payload: {
        value: IInput;
        infoRoom: IRoom | undefined;
        setValues: React.Dispatch<React.SetStateAction<IInput>>;
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleCheckRoom: (roomCode: string) => void;
    };
}) => {
    return (
        <div className="w-full">
            {payload.infoRoom && (
                <div className="mb-6 animate-slide-in-up rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
                    <h2 className="text-3xl font-bold text-white drop-shadow">🎯 {payload.infoRoom.name}</h2>
                    <p className="mt-2 text-white/90">Phòng đã được tìm thấy!</p>
                </div>
            )}

            {!payload.infoRoom && (
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Tham gia phòng chơi</h2>
                    <p className="mt-2 text-sm text-gray-600">Nhập mã phòng để bắt đầu</p>
                </div>
            )}

            <div className="flex items-end gap-3">
                <div className="flex-1">
                    <label htmlFor="roomCode" className="mb-2 block text-sm font-bold text-gray-700">
                        Mã phòng <span className="text-pink-500">*</span>
                    </label>
                    <Input
                        id="roomCode"
                        value={payload.value.roomCode}
                        onChange={payload.handleInputChange}
                        disabled={!!payload.infoRoom}
                        className="h-12 border-2 border-gray-300 text-center text-lg font-bold uppercase tracking-wider transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
                        placeholder="XXXX"
                        maxLength={6}
                    />
                </div>
                <Button
                    variant="fuchsia"
                    size="lg"
                    className="h-12 shadow-glow-pink transition-smooth hover:scale-105"
                    onClick={() => payload.handleCheckRoom(payload.value.roomCode)}
                    disabled={!payload.value.roomCode || !!payload.infoRoom}
                >
                    <LogIn className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

const InputInfoUser = ({
    payload,
}: {
    payload: {
        value: IInput;
        setValues: React.Dispatch<React.SetStateAction<IInput>>;
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleJoinRoom: (payload: IInput) => void;
    };
}) => {
    const { data } = useQuery({
        queryKey: ["list-club"],
        queryFn: async () => {
            const result = await Room.getListCLB();
            return result.data;
        },
        staleTime: 5 * 60 * 1000,
    });
    return (
        <form className="mt-8 w-full animate-slide-in-up space-y-5 border-t-2 border-gray-200 pt-8">
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800">📝 Thông tin của bạn</h3>
                <p className="text-sm text-gray-600">Vui lòng điền đầy đủ thông tin</p>
            </div>

            <div className="w-full">
                <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-gray-700">
                    Họ và tên <span className="text-pink-500">*</span>
                </label>
                <Input
                    id="fullName"
                    value={payload.value.fullName}
                    onChange={payload.handleInputChange}
                    className="h-12 border-2 border-gray-300 font-medium transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
                    placeholder="Nguyễn Văn A"
                    required
                />
            </div>

            <div className="w-full">
                <label htmlFor="category" className="mb-2 block text-sm font-bold text-gray-700">
                    Chọn CLB <span className="text-pink-500">*</span>
                </label>
                <Select onValueChange={(value) => payload.setValues((prev) => ({ ...prev, clubId: value }))}>
                    <SelectTrigger className="h-12! border-2 w-full border-gray-300 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-200">
                        <SelectValue placeholder="Chọn CLB của bạn" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel className="font-bold text-purple-600">Danh sách CLB</SelectLabel>
                            {data?.result.map((club) => (
                                <SelectItem key={club.id} value={club.id} className="cursor-pointer">
                                    {club.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Button
                type="button"
                onClick={() => payload.handleJoinRoom(payload.value)}
                variant="fuchsia"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold shadow-glow-pink transition-smooth hover:scale-105 hover:from-purple-700 hover:to-pink-700"
                disabled={!payload.value.fullName || !payload.value.clubId}
            >
                <Play className="h-6 w-6" /> Bắt đầu chơi
            </Button>
        </form>
    );
};

export default HomePage;
