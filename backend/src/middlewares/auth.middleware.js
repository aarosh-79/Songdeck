import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyTokenOptional = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
