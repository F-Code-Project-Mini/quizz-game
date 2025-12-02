import { NextFunction, Request, Response } from "express";
import { log } from "node:console";
import { TokenType } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import AlgoJwt from "~/utils/jwt";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Vui lòng đăng nhập để tiếp tục!",
        });
    }
    try {
        const payload = await AlgoJwt.verifyToken({ token });
        if (payload.type !== TokenType.AccessToken) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: "Token của bạn không hợp lệ!",
            });
        }
        req.userId = payload.userId;
        req.role = payload.role;

        next();
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!",
        });
    }
};
export const isRole = (roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    if (roles.includes(req.role as string)) {
        next();
    } else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Bạn không có quyền để thao tác!",
        });
    }
};
export const verifyToken =
    (type: TokenType, dataIn: "body" | "params" = "params") =>
    async (req: Request<{ token: string }>, res: Response, next: NextFunction) => {
        const { token } = dataIn === "params" ? req.params : req.body;
        try {
            const payload = await AlgoJwt.verifyToken({ token });
            if (payload.type !== type) {
                throw new ErrorWithStatus({
                    status: HTTP_STATUS.UNAUTHORIZED,
                    message: "Token không chính xác!",
                });
            }
            req.userId = payload.userId;
            next();
        } catch (error) {
            next(error);
        }
    };
