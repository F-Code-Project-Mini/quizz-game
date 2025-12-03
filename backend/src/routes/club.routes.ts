import { Router } from "express";
import { handleListClubs } from "~/controllers/club.controllers";

const clubRouter = Router();

clubRouter.get("/list", handleListClubs);

export default clubRouter;
