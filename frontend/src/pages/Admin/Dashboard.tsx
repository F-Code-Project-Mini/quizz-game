import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PlayCircle, Users, Trophy, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import privateApi from "~/lib/private-api";
import type { IRoom } from "~/types/room.types";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const { data: roomsData, isLoading } = useQuery({
        queryKey: ["admin-rooms"],
        queryFn: async () => {
            const response = await privateApi.get("/room/list-room");
            return response.data;
        },
    });

    const rooms: IRoom[] = roomsData?.result || [];

    const stats = [
        {
            icon: PlayCircle,
            label: "Tổng phòng",
            value: rooms.length,
            color: "from-purple-500 to-purple-600",
        },
        {
            icon: Users,
            label: "Phòng đang chờ",
            value: rooms.filter((r) => r.status === "WAITING").length,
            color: "from-blue-500 to-blue-600",
        },
        {
            icon: Clock,
            label: "Đang chơi",
            value: rooms.filter((r) => r.status === "IN_PROGRESS").length,
            color: "from-green-500 to-green-600",
        },
        {
            icon: Trophy,
            label: "Đã kết thúc",
            value: rooms.filter((r) => r.status === "FINISHED").length,
            color: "from-orange-500 to-orange-600",
        },
    ];

    const getStatusBadge = (status: string) => {
        const badges = {
            WAITING: "bg-blue-100 text-blue-700",
            IN_PROGRESS: "bg-green-100 text-green-700",
            FINISHED: "bg-gray-100 text-gray-700",
        };
        return badges[status as keyof typeof badges] || badges.WAITING;
    };

    const getStatusText = (status: string) => {
        const texts = {
            WAITING: "Đang chờ",
            IN_PROGRESS: "Đang chơi",
            FINISHED: "Đã kết thúc",
        };
        return texts[status as keyof typeof texts] || status;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-600">Tổng quan hệ thống Quiz Game</p>
                </div>
                <Button
                    onClick={() => navigate("/create-quiz")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Tạo phòng mới
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="rounded-xl bg-white p-5 shadow-md border hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                                    <p className="mt-2 text-3xl font-black text-gray-800">{stat.value}</p>
                                </div>
                                <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md border">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-800">Danh sách phòng</h2>
                </div>

                {isLoading ? (
                    <div className="py-12 text-center text-gray-500">Đang tải...</div>
                ) : rooms.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">Chưa có phòng nào</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 text-left text-sm font-bold text-gray-700">Tên phòng</th>
                                    <th className="pb-3 text-left text-sm font-bold text-gray-700">Mã phòng</th>
                                    <th className="pb-3 text-left text-sm font-bold text-gray-700">Trạng thái</th>
                                    <th className="pb-3 text-left text-sm font-bold text-gray-700">Ngày tạo</th>
                                    <th className="pb-3 text-right text-sm font-bold text-gray-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room.id} className="border-b hover:bg-gray-50">
                                        <td className="py-4 text-sm font-semibold text-gray-800">{room.name}</td>
                                        <td className="py-4">
                                            <code className="rounded bg-purple-100 px-2 py-1 text-sm font-bold text-purple-700">
                                                {room.code}
                                            </code>
                                        </td>
                                        <td className="py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(room.status)}`}
                                            >
                                                {getStatusText(room.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-gray-600">
                                            {new Date(room.createdAt).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/admin/room/${room.id}`)}
                                            >
                                                Quản lý
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
