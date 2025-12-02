import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
// đây là hàm xử lý lỗi (tất cả lỗi sẽ được truyền vô đây để xử lý)
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const { status, ...errs } = err;

    res.status(status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        Object.keys(errs).length > 0 ? errs : { message: "Đã có lỗi xảy ra" },
    );
};
