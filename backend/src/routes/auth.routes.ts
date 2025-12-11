import { Router } from "express";
import { handleLogin, handleCheckAuth, handleLogout } from "~/controllers/auth.controllers";
import * as authMiddleware from "~/middlewares/auth.middlewares";

const authRouter = Router();

authRouter.post("/login", handleLogin);
authRouter.get("/check", handleCheckAuth);
authRouter.post("/logout", handleLogout);

export default authRouter;
