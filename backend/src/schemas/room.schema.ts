import { v7 as uuidv7 } from "uuid";
//  id        String   @id @default(uuid()) @db.Char(36)
//   code      String   @db.VarChar(100)
//   name      String   @db.VarChar(255)
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
interface RoomType {
    id?: string;
    code: string;
    name: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

class Room {
    id: string;
    code: string;
    name: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(user: RoomType) {
        this.id = user.id || uuidv7();
        this.code = user.code;
        this.name = user.name;
        this.status = user.status || false;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default Room;
