import { Router } from "express";
import { handleLogin } from "~/controllers/auth.controllers";

const authRouter = Router();

authRouter.post("/login", handleLogin);

export default authRouter;
