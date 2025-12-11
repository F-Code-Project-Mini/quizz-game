import { Router } from "express";
import { checkRoomController, handleJoinRoom, handleListRoom } from "~/controllers/room.controllers.";
import { createQuizController } from "~/controllers/quiz.controllers";
import {
    startGameController,
    nextQuestionController,
    endGameController,
    resetGameController,
    getRoomStateController,
    getLeaderboardController,
    submitAnswerController,
} from "~/controllers/game.controllers";
import { joinRoomRule } from "~/rules/room.rules";
import { createQuizRule } from "~/rules/quiz.rules";
import { validate } from "~/utils/validation";
import * as authMiddleware from "~/middlewares/auth.middlewares";

const roomRouter = Router();

roomRouter.get("/check/:room", checkRoomController);
roomRouter.post("/join/:room", validate(joinRoomRule), handleJoinRoom);
roomRouter.get("/list-room", authMiddleware.auth, handleListRoom);
roomRouter.post("/create-quiz", validate(createQuizRule), createQuizController);

roomRouter.post("/:roomId/start", authMiddleware.auth, startGameController);
roomRouter.post("/:roomId/next", authMiddleware.auth, nextQuestionController);
roomRouter.post("/:roomId/end", authMiddleware.auth, endGameController);
roomRouter.post("/:roomId/reset", authMiddleware.auth, resetGameController);
roomRouter.get("/:roomId/state", getRoomStateController);
roomRouter.get("/:roomId/leaderboard", getLeaderboardController);
roomRouter.post("/submit-answer", submitAnswerController);

export default roomRouter;
