import { NextFunction, Request, Response } from "express";
import prisma from "~/configs/prisma";
import { IRoomStatus } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { IRequestJoinRoom } from "~/types/room.types";

export const checkRoomController = async (req: Request<{ room: string }>, res: Response, next: NextFunction) => {
    try {
        const { room } = req.params;
        const result = await prisma.room.findUnique({
            where: { code: room },
        });
        if (!result) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Mã phòng không tồn tại hoặc phòng đã đóng",
            });
        }
        return res.status(HTTP_STATUS.OK).json({
            success: !!result,
            result,
        });
    } catch (error) {
        next(error);
    }
};
export const handleJoinRoom = async (
    req: Request<{ room: string }, any, IRequestJoinRoom>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { room } = req.params;
        const { fullName, clubId } = req.body;
        const result = await Promise.all([
            prisma.room.findUnique({
                where: { code: room },
            }),
            prisma.club.findUnique({
                where: { id: clubId },
            }),
        ]);

        if (!result[0]) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Mã phòng không tồn tại hoặc phòng đã đóng",
            });
        }
        if (!result[1]) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Câu lạc bộ không tồn tại",
            });
        }
        const joinRoom = await prisma.player.create({
            data: {
                roomId: result[0].id,
                fullName: fullName,
                clubId: clubId,
            },
        });
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            result: {
                joinRoom,
                room: result[0],
                club: result[1],
            },
        });
    } catch (error) {
        next(error);
    }
};
