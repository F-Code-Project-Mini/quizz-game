import type { RolePlayer } from "~/constants/enum";

export interface IRoom {
    id: string;
    code: string;
    name: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface IRequestCheckRoom {
    success: boolean;
    result: IRoom;
}
export interface IPlayer {
    id: string;
    clubId: string;
    createdAt: string;
    fullName: string;
    role: RolePlayer;
    score: number;
    updatedAt: string;
}
export interface IResponsePlayer {
    id: string;
    fullName: string;
    clubId: string;
    playerId: string;
}
