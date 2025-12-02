import { PrismaClient } from "@prisma/client";
import Room from "../src/schemas/room.schema";
import clubSeed from "./seeds/club.seed";
import roomSeed from "./seeds/room.seed";

// 1. Khởi tạo Prisma Client
const prisma = new PrismaClient();
async function main() {
    const promises = Promise.all([roomSeed(), clubSeed()]);
    await promises;
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("Đã chạy hoàn tất seed dữ liệu cho các bảng");
        await prisma.$disconnect();
    });
