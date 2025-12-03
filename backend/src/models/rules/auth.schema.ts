// import z from "zod/v3";
// const jwtSchema = z.string().regex(/^[^.]+\.[^.]+\.[^.]+$/, "Token không hợp lệ!");
// const passwordSchema = z
//     .string()
//     .min(4, "Password phải >= 4 ký tự")
//     .regex(
//         /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+=\-]).{8,}$/,
//         "Password phải chứa ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt",
//     );
// export const registerSchema = z.object({
//     body: z
//         .object({
//             full_name: z.string().trim().nonempty(),
//             email: z.string().trim().email("Email không hợp lệ"),
//             password: passwordSchema,
//             confirm_password: z.string(),
//             role: z.enum(["VIEWER", "EDITOR", "ADMIN"]),
//         })
//         .refine((data) => data.password === data.confirm_password, {
//             message: "Mật khẩu nhập lại không khớp",
//             path: ["confirm_password"],
//         }),
// });

// export const loginSchema = z.object({
//     body: z.object({
//         email: z.string().trim().email(),
//         password: z.string().trim().nonempty(),
//     }),
// });
// export const forgotPasswordSchema = z.object({
//     body: z.object({
//         email: z.string().trim().email("Email không hợp lệ"),
//     }),
// });
// export const resetPasswordParamsSchema = z.object({
//     params: z.object({
//         token: jwtSchema,
//     }),
// });
// export const resetPasswordSchema = z.object({
//     params: z.object({
//         token: jwtSchema,
//     }),
//     body: z
//         .object({
//             password: passwordSchema,
//             confirm_password: z.string(),
//         })
//         .refine((data) => data.password === data.confirm_password, {
//             message: "Mật khẩu nhập lại không khớp",
//             path: ["confirm_password"],
//         }),
// });
// export const changePasswordSchema = z.object({
//     body: z
//         .object({
//             old_password: z.string().trim().nonempty(),
//             new_password: passwordSchema,
//             confirm_new_password: z.string().trim().nonempty(),
//         })
//         .refine((data) => data.old_password !== data.new_password, {
//             message: "Mật khẩu mới phải khác với mật khẩu cũ!",
//             path: ["new_password"],
//         })
//         .refine((data) => data.new_password === data.confirm_new_password, {
//             message: "Mật khẩu nhập lại không khớp!",
//             path: ["confirm_new_password"],
//         }),
// });
// export const verifyEmailParamsSchema = z.object({
//     params: z.object({
//         token: jwtSchema,
//     }),
// });
// export const refreshTokenSchema = z.object({
//     body: z.object({
//         token: jwtSchema,
//     }),
// });
