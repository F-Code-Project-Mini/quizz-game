import { PrismaClient } from "@prisma/client";
import Club from "../../src/schemas/club.schema";
const prisma = new PrismaClient();
const clubSeed = async () => {
    await prisma.club.deleteMany({});
    const data = ["CLB F-CODE", "CLB - MOBILE", "CLB - AI"];
    const clubs = data.map((name) => new Club({ name }));
    await prisma.club.createMany({
        data: clubs,
    });
};
export default clubSeed;
