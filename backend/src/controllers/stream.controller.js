import { prisma } from "../lib/prisma.js";
import { streamSchema } from "../validation/stream.validation.js";
import { z } from "zod";

export const addStream = async (req, res, next) => {
  try {
    const { spaceId } = req.params;
    const userId = req.user.id;

    const validation = streamSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { type, url, extractedId, title, smallImg, bigImg } = validation.data;

    const stream = await prisma.stream.create({
      data: {
        type,
        url,
        extractedId,
        title: title || "",
        smallImg: smallImg || "",
        bigImg: bigImg || "",
        userId,
        addedBy: userId,
        spaceId,
      },
      include: {
        user: true,
        addedByUser: true,
        upvotes: true,
      },
    });

    res.status(201).json({
      message: "Stream added successfully",
      data: stream,
    });
  } catch (error) {
    next(error);
  }
};

export const getStreams = async (req, res, next) => {
  try {
    const { spaceId } = req.params;

    const streams = await prisma.stream.findMany({
      where: {
        spaceId,
        active: true,
      },
      orderBy: [
        { played: "asc" }, 
        { createAt: "desc" },
      ],
      include: {
        user: true,
        addedByUser: true,
        upvotes: true,
      },
    });

    res.json({
      data: streams,
    });
  } catch (error) {
    next(error);
  }
};

export const getStreamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const stream = await prisma.stream.findUnique({
      where: { id },
      include: {
        user: true,
        addedByUser: true,
        upvotes: true,
      },
    });

    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }

    res.json({
      data: stream,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStream = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validation = streamSchema
      .partial()
      .extend({
        active: z.boolean().optional(),
      })
      .safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { title, smallImg, bigImg, active } = validation.data;

    const stream = await prisma.stream.update({
      where: { id },
      data: {
        title: title || undefined,
        smallImg: smallImg || undefined,
        bigImg: bigImg || undefined,
        active: active !== undefined ? active : undefined,
      },
      include: {
        user: true,
        addedByUser: true,
        upvotes: true,
      },
    });

    res.json({
      message: "Stream updated successfully",
      data: stream,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStream = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.stream.update({
      where: { id },
      data: { active: false },
    });

    res.json({
      message: "Stream deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStreams = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const streams = await prisma.stream.findMany({
      where: {
        addedBy: userId,
        active: true,
      },
      orderBy: { createAt: "desc" },
      include: {
        user: true,
        addedByUser: true,
        upvotes: true,
      },
    });

    res.json({
      data: streams,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWorkspaceStreams = async (req, res, next) => {
  try {
    const { userId, spaceId } = req.params;

    const streams = await prisma.stream.findMany({
      where: {
        addedBy: userId,
        spaceId,
        active: true,
      },
      orderBy: { createAt: "desc" },
      include: {
        user: true,
        addedByUser: true,
        upvotes: true,
      },
    });

    res.json({
      data: streams,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlayedStreams = async (req, res, next) => {
  try {
    const { spaceId } = req.params;

    const streams = await prisma.stream.findMany({
      where: {
        spaceId,
        played: true,
        active: true,
      },
      orderBy: { playedTs: "desc" },
      include: {
        user: true,
        addedByUser: true,
        upvotes: true,
      },
    });

    res.json({
      data: streams,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnplayedStreams = async (req, res, next) => {
  try {
    const { spaceId } = req.params;

    const streams = await prisma.stream.findMany({
      where: {
        spaceId,
        played: false,
        active: true,
      },
      orderBy: { createAt: "asc" },
      include: {
        user: true,
        addedByUser: true,
        upvotes: true,
      },
    });

    res.json({
      data: streams,
    });
  } catch (error) {
    next(error);
  }
};
