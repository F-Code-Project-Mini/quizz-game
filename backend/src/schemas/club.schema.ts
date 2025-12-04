import { randomUUID } from "crypto";


interface ClubType {
    id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Club {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(user: ClubType) {
        this.id = user.id || randomUUID();
        this.name = user.name;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Club;
