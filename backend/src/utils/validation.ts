import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod/v3";
import { HTTP_STATUS } from "~/constants/httpStatus";
import Helpers from "./helpers";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        // Gộp body, params, query vào validate một lần
        const result = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (result.body !== undefined) req.body = result.body || {};
        if (result.params !== undefined) req.params = result.params || {};
        // if (result.query !== undefined) req.query = result.query || {};

        return next();
    } catch (err) {
        if (err instanceof ZodError) {
            const errors: string[] = [];
            // console.log(Array(...err.issues));

            for (let error of Array(...err.issues)) {
                errors.push(Helpers.converFirstUpper(`${error.path.join(" ")} ${error.message}`));
            }

            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: errors[0] || "Kiểm tra dữ liệu đầu vào thất bại!",
                errors,
            });
        }
        return next(err);
    }
};
