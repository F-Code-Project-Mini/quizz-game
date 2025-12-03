import { PrismaClient } from "@prisma/client";
import Room from "../../src/schemas/room.schema";
const prisma = new PrismaClient();
const roomSeed = async () => {
    await prisma.room.deleteMany();

    const userId = await prisma.user.findFirst();
    await prisma.room.createMany({
        data: [
            new Room({
                userId: userId?.id || "",
                code: "ROOMA",
                name: "QUIZZ GAME GIẢI TRÍ CLB",
                status: true,
            }),
        ],
    });
};
export default roomSeed;
