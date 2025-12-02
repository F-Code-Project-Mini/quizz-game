// import { NextFunction, ParamsDictionary } from "express-serve-static-core";
// import { Request, Response } from "express";
// import { LoginRequestBody, RegisterRequestBody } from "~/models/requests/user.request";
// import userService from "~/services/user.service";
// import { HTTP_STATUS } from "~/constants/httpStatus";
// import { ExpiresInTokenType } from "~/constants/enums";

// export const register = async (
//     req: Request<ParamsDictionary, any, RegisterRequestBody>,
//     res: Response,
//     next: NextFunction,
// ) => {
//     try {
//         const result = await userService.create(req.body);
//         return res.status(HTTP_STATUS.CREATED).json({
//             message: "Bạn đã đăng ký tài khoản thành công trên hệ thống!",
//             result,
//         });
//     } catch (error) {
//         return next(error);
//     }
// };
// export const logout = async (req: Request, res: Response, next: NextFunction) => {
//     res.clearCookie("access_token");
//     res.clearCookie("refresh_token");
//     return res.json({
//         message: "Đã xóa cookie",
//     });
// };
// export const login = async (
//     req: Request<ParamsDictionary, any, LoginRequestBody>,
//     res: Response,
//     next: NextFunction,
// ) => {
//     try {
//         const result = await userService.login(req.body);
//         res.cookie("access_token", result.access_token, {
//             maxAge: ExpiresInTokenType.AccessToken * 1000,
//             httpOnly: true,
//             secure: true,
//             sameSite: "strict",
//         });
//         res.cookie("refresh_token", result.refresh_token, {
//             maxAge: ExpiresInTokenType.RefreshToken * 1000,
//             httpOnly: true,
//             secure: true,
//             sameSite: "strict",
//         });
//         return res.status(HTTP_STATUS.OK).json({
//             message: "Bạn đã đăng nhập thành công!",
//             result,
//         });
//     } catch (error) {
//         return next(error);
//     }
// };
// export const me = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response, next: NextFunction) => {
//     try {
//         const result = await userService.me(req.userId as string);
//         return res.status(HTTP_STATUS.OK).json({
//             message: "Bạn đã lấy thông tin thành công",
//             result,
//         });
//     } catch (error) {
//         return next(error);
//     }
// };
// export const getAll = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const result = await userService.getAll();
//         return res.status(HTTP_STATUS.OK).json({
//             message: "Bạn đã lấy thông tin thành công",
//             result,
//         });
//     } catch (error) {
//         return next(error);
//     }
// };
// // export const refreshToken = async (
// //     req: Request<ResetPasswordRequestParams, any, RefreshTokenRequestBody>,
// //     res: Response,
// //     next: NextFunction,
// // ) => {
// //     const { token } = req.body;
// //     const userId = req.userId as string;
// //     try {
// //         const result = await userService.refreshToken(userId, token);
// //         return res.status(HTTP_STATUS.OK).json({
// //             message: "Cấp lại token mới thành công!",
// //             result,
// //         });
// //     } catch (error) {
// //         return next(error);
// //     }
// // };
