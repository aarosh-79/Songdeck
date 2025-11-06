import { Router } from "express";
import {
  setCurrentStream,
  getCurrentStream,
  endCurrentStream,
  getCurrentStreamByUser,
} from "../controllers/currentStream.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/workspace/:spaceId", getCurrentStream);

router.post("/", verifyToken, setCurrentStream);
router.delete("/workspace/:spaceId", verifyToken, endCurrentStream);
router.get("/user/:userId", verifyToken, getCurrentStreamByUser);

export default router;