import { Router } from "express";
import { values } from "lodash";
import { checkRoomController, handleJoinRoom } from "~/controllers/room.controllers.";
import { joinRoomRule } from "~/rules/room.rules";
import { validate } from "~/utils/validation";

const roomRouter = Router();

roomRouter.get("/check/:room", checkRoomController);
roomRouter.post("/join/:room", validate(joinRoomRule), handleJoinRoom);

export default roomRouter;
