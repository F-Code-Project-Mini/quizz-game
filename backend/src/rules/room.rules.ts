import z from "zod/v3";

export const joinRoolRule = z.object({
    params: z.object({
        room: z.string().min(1, "Mã phòng không được để trống"),
    }),
    body: z.object({
        fullName: z
            .string()
            .min(2, "Họ và tên phải có ít nhất 2 ký tự")
            .max(50, "Họ và tên không được vượt quá 50 ký tự"),
        clubId: z.string().nonempty("Mã câu lạc bộ không được để trống").uuid("Mã câu lạc bộ không hợp lệ"),
    }),
});
