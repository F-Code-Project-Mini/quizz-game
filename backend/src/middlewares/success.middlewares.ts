import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
export const defaultSuccessHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTP_STATUS.OK).json();
};
