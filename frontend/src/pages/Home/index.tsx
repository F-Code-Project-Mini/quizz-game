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
        <div className="flex min-h-screen flex-col items-center justify-center bg-[url('https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455632.jpg?semt=ais_hybrid&w=740&q=80')] bg-cover bg-center py-4">
            <div className="mx-5 flex w-full max-w-2xl flex-col items-center rounded-xl bg-white p-6 pb-15 shadow-2xl">
                <JoinRoomForm payload={{ value, infoRoom, setValues, handleInputChange, handleCheckRoom }} />
                {isValidRoom && <InputInfoUser payload={{ value, setValues, handleInputChange, handleJoinRoom }} />}
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
        <>
            <img src="/logo.svg" alt="Logo" className="mx-auto" />
            <h2 className="text-center text-2xl font-bold text-gray-800">
                {payload.infoRoom?.name || "Join Quiz Game"}
            </h2>
            <div className="flex w-full items-end gap-4 rounded-xl">
                <div className="w-full">
                    <label htmlFor="roomCode" className="mb-2 block text-sm font-semibold text-gray-700">
                        Mã phòng
                    </label>
                    <Input
                        id="roomCode"
                        value={payload.value.roomCode}
                        onChange={payload.handleInputChange}
                        disabled={!!payload.infoRoom}
                        className="w-full border-gray-300 py-3 font-medium"
                        placeholder="Enter code room"
                    />
                </div>
                <Button
                    variant={"fuchsia"}
                    onClick={() => payload.handleCheckRoom(payload.value.roomCode)}
                    disabled={!payload.value.roomCode || !!payload.infoRoom}
                >
                    <LogIn />
                </Button>
            </div>
        </>
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
        <form className="mt-6 w-full space-y-6">
            <div className="w-full">
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-gray-700">
                    Họ và tên <span className="text-red-500">*</span>
                </label>
                <Input
                    id="fullName"
                    value={payload.value.fullName}
                    onChange={payload.handleInputChange}
                    className="w-full border-gray-300 py-3 font-medium transition-all focus:ring-2 focus:ring-fuchsia-500"
                    placeholder="Enter your name"
                    required
                />
            </div>

            <div className="w-full">
                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-gray-700">
                    Chọn CLB <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => payload.setValues((prev) => ({ ...prev, clubId: value }))}>
                    <SelectTrigger className="w-full border-gray-300 py-3">
                        <SelectValue placeholder="Choose a CLB" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>CLB</SelectLabel>
                            {data?.result.map((club) => (
                                <SelectItem key={club.id} value={club.id}>
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
                className="w-full"
            >
                <Play /> Start Game
            </Button>
        </form>
    );
};

export default HomePage;
