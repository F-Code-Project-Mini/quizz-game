import { PrismaClient } from "@prisma/client";
import clubSeed from "./seeds/club.seed";
import userSeed from "./seeds/user.seed";
import roomSeed from "./seeds/room.seed";
import questionSeed from "./seeds/question.seed";

// 1. Khởi tạo Prisma Client
const prisma = new PrismaClient();
async function main() {
    await Promise.all([userSeed(), clubSeed()]);
    await roomSeed();
    await questionSeed();
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
