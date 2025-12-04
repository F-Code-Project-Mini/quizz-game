import { randomUUID } from "crypto";

interface UserType {
    id?: string;
    username: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class User {
    id: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: UserType) {
        this.id = user.id || randomUUID();
        this.username = user.username;
        this.password = user.password;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default User;
