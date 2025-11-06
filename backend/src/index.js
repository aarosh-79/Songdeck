import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

import userRouter from "./routes/user.route.js";
import workspaceRouter from "./routes/workspace.route.js";
import streamRouter from "./routes/stream.route.js";
import currentStreamRouter from "./routes/currentStream.route.js";
import upvoteRouter from "./routes/upvote.route.js";

import { errorHandler, notFound } from "./middlewares/error.middleware.js";

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/workspaces", workspaceRouter);
app.use("/api/v1/streams", streamRouter);
app.use("/api/v1/current-streams", currentStreamRouter);
app.use("/api/v1/upvotes", upvoteRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Songdeck API is running!" });
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Application is listening at PORT ${PORT}`);
});

export default app;
