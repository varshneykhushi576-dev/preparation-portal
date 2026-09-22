import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { createQuestion, generateMockTest, submitTest } from "../controllers/Question.controllers.js";


const router = Router();

router.route("/createques").post(verifyJWT, isAdmin, createQuestion);
router.route("/genMock").post(generateMockTest)
router.route("/submitTest").post(submitTest)

export default router
