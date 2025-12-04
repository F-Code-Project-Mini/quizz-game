import { randomUUID } from "crypto";

interface PlayerType {
    id: string;
    fullName: string;
    clubId: string;
    score?: number;
    createdAt?: Date;
    endAt?: Date;
    updatedAt?: Date;
}

class Player {
    id: string;
    fullName: string;
    clubId: string;
    score: number;
    createdAt: Date;
    endAt: Date;
    updatedAt: Date;
    constructor(user: PlayerType) {
        this.id = user.id || randomUUID();
        this.fullName = user.fullName;
        this.clubId = user.clubId;
        this.score = user.score || 0;
        this.createdAt = user.createdAt || new Date();
        this.endAt = user.endAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Player;
