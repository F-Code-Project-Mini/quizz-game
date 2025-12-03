import { v7 as uuidv7 } from "uuid";

interface RoomType {
    id?: string;
    userId: string;
    code: string;
    name: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

class Room {
    id: string;
    userId: string;
    code: string;
    name: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(user: RoomType) {
        this.id = user.id || uuidv7();
        this.userId = user.userId;
        this.code = user.code;
        this.name = user.name;
        this.status = user.status || false;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Room;
