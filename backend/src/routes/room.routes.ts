import { Router } from "express";
import { values } from "lodash";
import { checkRoomController, handleJoinRoom } from "~/controllers/room.controllers.";
import { createQuizController } from "~/controllers/quiz.controllers";
import { joinRoomRule } from "~/rules/room.rules";
import { createQuizRule } from "~/rules/quiz.rules";
import { validate } from "~/utils/validation";

const roomRouter = Router();

roomRouter.get("/check/:room", checkRoomController);
roomRouter.post("/join/:room", validate(joinRoomRule), handleJoinRoom);
roomRouter.post("/create-quiz", validate(createQuizRule), createQuizController);

export default roomRouter;
