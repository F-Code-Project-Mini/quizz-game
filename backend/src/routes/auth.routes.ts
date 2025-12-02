import { Router } from "express";
import * as authController from "~/controllers/users.controllers";
import * as authMiddleware from "~/middlewares/auth.middlewares";
import { loginSchema, registerSchema } from "~/models/rules/auth.schema";
import { validate } from "~/utils/validation";

const authRouter = Router();

// định nghĩa routing
authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/logout", authController.logout);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/me", authMiddleware.auth, authController.me);
authRouter.get("/get-all", authMiddleware.auth, authController.getAll);
export default authRouter;
