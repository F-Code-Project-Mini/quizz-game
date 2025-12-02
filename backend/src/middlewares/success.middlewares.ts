import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
// đây là hàm xử lý lỗi (tất cả lỗi sẽ được truyền vô đây để xử lý)
export const defaultSuccessHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTP_STATUS.OK).json();
};
