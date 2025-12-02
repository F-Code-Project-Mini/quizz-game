import publicApi from "~/lib/axios-instance";
import type { IRequestGetListClub } from "~/types/club.types";
import type { IRequestCheckRoom } from "~/types/room.types";

class Room {
    static getRoom = (roomCode: string) => publicApi.get<IRequestCheckRoom>(`/room/check/${roomCode}`);
    static joinRoom = ({ roomCode, fullName, clubId }: { roomCode: string; fullName: string; clubId: string }) =>
        publicApi.post(`/room/join/${roomCode}`, { fullName, clubId });

    static getListCLB = () => publicApi.get<IRequestGetListClub>(`/club/list`);
}

export default Room;
