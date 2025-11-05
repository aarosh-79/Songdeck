import { Router } from "express";
import { signupuser } from "../controllers/user.controller.js";
import { loginuser } from "../controllers/user.controller.js";
const router = Router()
    router.route("/login").post(loginuser)
    router.route("/signup").post(signupuser)

    export default router