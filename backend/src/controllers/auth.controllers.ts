import { Request, Response } from 'express';
import prisma from '~/configs/prisma';
import bcrypt from 'bcrypt';
import AlgoJwt from '~/utils/jwt';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ExpiresInTokenType } from '~/constants/enums';

export const handleLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).send("Thông tin đăng nhập không chính xác!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).send("Thông tin đăng nhập không chính xác!");
        }

        const token = await AlgoJwt.signToken({ payload: { userId: user.id, username: user.username } });

        res.cookie('Set-Cookie', token, { httpOnly: true, secure : true, maxAge : ExpiresInTokenType.AccessToken });

        return res.status(HTTP_STATUS.OK).json({});
    } catch (error) {
        console.error(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Đã xảy ra lỗi máy chủ.' });
    }
};
