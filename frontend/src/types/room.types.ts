import type { RolePlayer } from "~/constants/enum";

export interface IRoom {
    id: string;
    code: string;
    name: string;
    status: "WAITING" | "IN_PROGRESS" | "FINISHED";
    createdAt: string;
    updatedAt: string;
    questions?: Array<{
        id: string;
        question: string;
        timeQuestion: number;
        answers: Array<{
            id: string;
            answer: string;
            isCorrect: boolean;
        }>;
    }>;
    players?: Array<{
        id: string;
        fullName: string;
        score: number;
        club: {
            id: string;
            name: string;
        };
    }>;
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
