import {Router} from "express";
import { createUser, generateTokens, loginUser } from "../controllers/user.controllers";
 const router = Router()

 router.route("/tokens").post(generateTokens)
 router.route("/createuser").post(createUser)
 router.route("/login").post(loginUser)

 export default router