import { v7 as uuidv7 } from "uuid";
import { RoleType } from "~/constants/enums";

interface UserType {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    role?: RoleType;
    createdAt?: Date;
    updatedAt?: Date;
}

class User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: RoleType;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: UserType) {
        this.id = user.id || uuidv7();
        this.fullName = user.fullName;
        this.email = user.email;
        this.password = user.password;
        // Giá trị mặc định là VIEWER để khớp với Prisma Schema
        this.role = user.role || RoleType.VIEWER;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default User;
