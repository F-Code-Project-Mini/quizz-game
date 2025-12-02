import { ParamsDictionary } from "express-serve-static-core";
import { NextFunction, Request, Response } from "express";
import prisma from "~/configs/prisma";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";

export const handleListClubs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clubs = await prisma.club.findMany();
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: clubs,
        });
    } catch (error) {
        next(error);
    }
};
