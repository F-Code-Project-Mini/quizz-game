import { Router } from "express";
import { values } from "lodash";
import { checkRoomController, handleJoinRoom, handleListRoom } from "~/controllers/room.controllers.";
import { joinRoomRule } from "~/rules/room.rules";
import { validate } from "~/utils/validation";
import * as authMiddleware from "~/middlewares/auth.middlewares";

const roomRouter = Router();

roomRouter.get("/check/:room", checkRoomController);
roomRouter.post("/join/:room", validate(joinRoomRule), handleJoinRoom);
roomRouter.get("/list-room", authMiddleware.auth, handleListRoom);

export default roomRouter;
