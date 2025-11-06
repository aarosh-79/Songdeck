import { prisma } from "../lib/prisma.js";
import { z } from "zod";

export const createUpvote = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const validation = z.object({
      streamId: z.string().uuid("Stream ID must be a valid UUID"),
    }).safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { streamId } = validation.data;

    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_streamId: {
          userId,
          streamId,
        },
      },
    });

    if (existingUpvote) {
      return res.status(409).json({ message: "User has already upvoted this stream" });
    }

    const upvote = await prisma.upvote.create({
      data: {
        userId,
        streamId,
      },
      include: {
        user: true,
        stream: {
          include: {
            user: true,
            addedByUser: true,
          },
        },
      },
    });

    await prisma.stream.update({
      where: { id: streamId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "Upvote created successfully",
      data: upvote,
    });
  } catch (error) {
    next(error);
  }
};

export const removeUpvote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const validation = z.object({
      streamId: z.string().uuid("Stream ID must be a valid UUID"),
    }).safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { streamId } = validation.data;

    const deletedUpvote = await prisma.upvote.delete({
      where: {
        userId_streamId: {
          userId,
          streamId,
        },
      },
      include: {
        user: true,
        stream: {
          include: {
            user: true,
            addedByUser: true,
          },
        },
      },
    });

    await prisma.stream.update({
      where: { id: streamId },
      data: {
        upvotes: {
          decrement: 1,
        },
      },
    });

    res.json({
      message: "Upvote removed successfully",
      data: deletedUpvote,
    });
  } catch (error) {
    next(error);
  }
};

export const getStreamUpvotes = async (req, res, next) => {
  try {
    const { streamId } = req.params;

    const upvotes = await prisma.upvote.findMany({
      where: { streamId },
      include: {
        user: true,
      },
    });

    res.json({
      data: upvotes,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserUpvotes = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const upvotes = await prisma.upvote.findMany({
      where: { userId },
      include: {
        stream: {
          include: {
            user: true,
            addedByUser: true,
          },
        },
      },
    });

    res.json({
      data: upvotes,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceUpvotes = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const upvotes = await prisma.upvote.findMany({
      where: {
        stream: {
          spaceId: workspaceId,
        },
      },
      include: {
        user: true,
        stream: {
          include: {
            user: true,
            addedByUser: true,
          },
        },
      },
    });

    res.json({
      data: upvotes,
    });
  } catch (error) {
    next(error);
  }
};