import { Router } from "express";
import { values } from "lodash";
import { handleListClubs } from "~/controllers/club.controllers";
import { checkRoomController, handleJoinRoom } from "~/controllers/room.controllers.";
import { joinRoolRule } from "~/rules/room.rules";
import { validate } from "~/utils/validation";

const clubRouter = Router();

clubRouter.get("/list", handleListClubs);

export default clubRouter;
