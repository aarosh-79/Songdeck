import express from "express";
import {
  requestSong,
  getSongs,
  voteSong,
  getQueue
} from "../controllers/song.controller.js";

const router = express.Router();

// Request a song
router.post("/workspaces/:workspaceId/songs", requestSong);

// Get all songs for a workspace
router.get("/workspaces/:workspaceId/songs", getSongs);

// Vote for a song
router.post("/workspaces/:workspaceId/vote", voteSong);

// Get the queue
router.get("/workspaces/:workspaceId/queue", getQueue);

export default router;
