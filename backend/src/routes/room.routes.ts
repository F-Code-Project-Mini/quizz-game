import { Router } from "express";
import { checkRoomController, handleJoinRoom, handleListRoom } from "~/controllers/room.controllers.";
import { createQuizController } from "~/controllers/quiz.controllers";
import { joinRoomRule } from "~/rules/room.rules";
import { createQuizRule } from "~/rules/quiz.rules";
import { validate } from "~/utils/validation";
import * as authMiddleware from "~/middlewares/auth.middlewares";

const roomRouter = Router();

roomRouter.get("/check/:room", checkRoomController);
roomRouter.post("/join/:room", validate(joinRoomRule), handleJoinRoom);
roomRouter.get("/list-room", authMiddleware.auth, handleListRoom);
roomRouter.post("/create-quiz", validate(createQuizRule), createQuizController);

export default roomRouter;
