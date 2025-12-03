import z from "zod/v3";

export const joinRoomRule = z.object({
    params: z.object({
        room: z.string().min(1, "Mã phòng không được để trống"),
    }),
    body: z.object({
        fullName: z
            .string()
            .min(6, "Họ và tên phải có ít nhất 6 ký tự")
            .max(100, "Họ và tên không được vượt quá 100 ký tự"),
        clubId: z.string().nonempty("Mã câu lạc bộ không được để trống").uuid("Mã câu lạc bộ không hợp lệ"),
    }),
});
