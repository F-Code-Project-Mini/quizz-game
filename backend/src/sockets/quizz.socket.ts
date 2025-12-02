import { Server, Socket } from "socket.io";
import prisma from "~/configs/prisma";
interface IJoinGame {
    roomCode: string;
    fullName: string;
    playerId: string;
    clubId: string;
}
export interface Participant {
    id: string;
    fullName: string;
    clubId: string;
    playerId: string;
}
const roomsState = new Map<string, Participant[]>();
const handleJoinGame = async (socket: Socket, io: Server, data: IJoinGame) => {
    const { roomCode, fullName, playerId, clubId } = data;
    console.log(clubId);

    socket.join(roomCode);
    const newPlayer = { id: socket.id, fullName, playerId, clubId };
    if (!roomsState.has(roomCode)) {
        roomsState.set(roomCode, []);
    }
    if (!roomsState.get(roomCode)?.find((p) => p.playerId === playerId)) {
        roomsState.get(roomCode)?.push(newPlayer);
    }
    console.log(
        "All data",
        roomsState.get(roomCode)?.filter((p) => p.clubId === clubId),
    );

    io.to(roomCode).emit(
        `update_participants_${clubId}`,
        roomsState.get(roomCode)?.filter((p) => p.clubId === clubId),
    );
};
const handleDisconnect = (socket: Socket, io: Server) => {
    console.log("------------------");

    roomsState.forEach(async (participants, roomCode) => {
        console.log(participants);

        const index = participants.findIndex((p) => p.id === socket.id);
        if (index !== -1) {
            const disconnectedPlayer = participants[index];
            participants.splice(index, 1);

            io.to(roomCode).emit(`update_participants_${disconnectedPlayer.clubId}`, participants);
            console.log(`Player ${disconnectedPlayer.fullName} disconnected from room ${roomCode}`);
        }
    });
};
const socketQuizz = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        // console.log("⚡️ A user connected. Socket ID:", socket.id);

        socket.on("join_game", (data: IJoinGame) => handleJoinGame(socket, io, data));

        socket.on("disconnect", () => handleDisconnect(socket, io));
    });
};
export default socketQuizz;
