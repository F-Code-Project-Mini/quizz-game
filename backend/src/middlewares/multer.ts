import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

const upload = (dir: string = "") => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./uploads${dir}`);
        },
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname);
            cb(null, `${Date.now()}_${fileExtension}`);
        },
    });
    const upload = multer({
        storage,
    });
    return upload;
};

export const uploadIfFile = (dir: string, field: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.body && req.body.hasOwnProperty(field)) {
        upload(dir).single(field)(req, res, next); // Nếu có file, áp dụng multer
    } else {
        next(); // Nếu không có file, tiếp tục xử lý request mà không áp dụng multer
    }
};
export default upload;
