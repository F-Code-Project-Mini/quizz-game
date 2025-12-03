import { PrismaClient } from "@prisma/client";
import User from "../../src/schemas/user.schema";
import AlgoCrypto from "./../../src/utils/crypto";
const prisma = new PrismaClient();
const clubSeed = async () => {
    await prisma.user.deleteMany({});
    const password = await AlgoCrypto.hashPassword("admin123");
    await prisma.user.create({
        data: new User({
            username: "admin",
            password,
        }),
    });
};
export default clubSeed;
