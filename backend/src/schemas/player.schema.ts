import { v7 as uuidv7 } from "uuid";

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
        this.id = user.id || uuidv7();
        this.fullName = user.fullName;
        this.clubId = user.clubId;
        this.score = user.score || 0;
        this.createdAt = user.createdAt || new Date();
        this.endAt = user.endAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Player;
