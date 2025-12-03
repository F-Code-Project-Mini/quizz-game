import { PrismaClient } from "@prisma/client";
import Club from "../../src/schemas/club.schema";
const prisma = new PrismaClient();
const clubSeed = async () => {
    await prisma.club.deleteMany({});
    const data = [
        "FPT Beat King Club",
        "FPTU Traditional Instruments",
        "FStyle Hiphop Club",
        "F# Live Music Club",
        "Japan Style Club",
        "FPT RadiSound Club",
        "Câu lạc bộ Truyền thông Cóc Sài Gòn",
        "FPT Cooking Forever",
        "MEC - Multimedia & Entertainment Club",
        "Câu lạc bộ Tổ chức Sự kiện trường Đại học FPT",
        "Cộng đồng Sinh viên Tình nguyện SiTiGroup",
        "CLB Đại Sứ Sinh Viên",
        "FPT Chess Club",
        "FPT Vovinam Club",
        "ESports FPTU HCMC",
        "FPT Volleyball Club",
        "FPT Southern Calisthenics",
        "FPTU Basketball Club",
        "FFC - Câu lạc bộ bóng đá FPTU HCM",
        "FPT Innovation Path",
        "ELF for Community",
        "Mathematics Thinking Club",
        "Japanese Chinese Language",
        "Câu lạc bộ 9.5AI",
        "Dynamic Art Club",
        "FPT Information Assurance Club",
        "F-Code",
        "ELF Academic Club",
        "Integrated Circuit Design",
        "BlockUni - The Blockchain Academic Community",
        "Google Developer Group on Campus FPTU",
        "Business Economics Club",
        "Soft Skills Club",
        "Câu lạc bộ Kỹ năng và Ngôn ngữ",
        "AI For Software Development",
        "DevSecOps",
        "FPT Logistics & Supply Chain Club",
        "IoT Innovators Club",
    ];
    const clubs = data.map((name) => new Club({ name }));
    await prisma.club.createMany({
        data: clubs,
    });
};
export default clubSeed;
