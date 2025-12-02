import { v7 as uuidv7 } from "uuid";
import { RolePlayer } from "~/constants/enums";

interface PlayerType {
    id: string;
    fullName: string;
    clubId: string;
    score?: number;
    role?: RolePlayer;
    createdAt?: Date;
    updatedAt?: Date;
}

class Player {
    id: string;
    fullName: string;
    clubId: string;
    score: number;
    role: RolePlayer;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(user: PlayerType) {
        this.id = user.id || uuidv7();
        this.fullName = user.fullName;
        this.clubId = user.clubId;
        this.score = user.score || 0;
        this.role = user.role || RolePlayer.MEMBER;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Player;
