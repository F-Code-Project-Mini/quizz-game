
import { randomUUID } from "crypto";
import { IRoomStatus } from "../constants/enums";

interface RoomType {
    id?: string;
    userId: string;
    code: string;
    name: string;
    status?: IRoomStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

class Room {
    id: string;
    userId: string;
    code: string;
    name: string;
    status: IRoomStatus;
    createdAt: Date;
    updatedAt: Date;
    constructor(user: RoomType) {
        this.id = user.id || randomUUID();
        this.userId = user.userId;
        this.code = user.code;
        this.name = user.name;
        this.status = user.status || IRoomStatus.WAITING;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Room;
