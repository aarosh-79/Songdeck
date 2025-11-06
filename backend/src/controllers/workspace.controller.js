import { prisma } from "../lib/prisma.js";
import { workspaceSchema } from "../validation/workspace.validation.js";

export const createWorkspace = async (req, res, next) => {
  try {
    const validation = workspaceSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { name, hostId } = validation.data;

    const workspace = await prisma.workspaceSpace.create({
      data: {
        name,
        hostId,
      },
      include: {
        host: true,
        streams: true,
        currentStream: true,
      },
    });

    res.status(201).json({
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await prisma.workspaceSpace.findMany({
      where: {
        isActive: true,
      },
      include: {
        host: true,
        streams: {
          where: {
            active: true,
          },
          include: {
            user: true,
            addedByUser: true,
          },
        },
        currentStream: {
          include: {
            stream: true,
          },
        },
      },
    });

    res.json({
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workspace = await prisma.workspaceSpace.findUnique({
      where: { id },
      include: {
        host: true,
        streams: {
          where: {
            active: true,
          },
          orderBy: {
            createAt: "desc",
          },
          include: {
            user: true,
            addedByUser: true,
            upvotes: true,
          },
        },
        currentStream: {
          include: {
            stream: true,
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json({
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkspace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validation = workspaceSchema.partial().safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { name, isActive } = validation.data;

    const workspace = await prisma.workspaceSpace.update({
      where: { id },
      data: {
        name: name || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      include: {
        host: true,
      },
    });

    res.json({
      message: "Workspace updated successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.workspaceSpace.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      message: "Workspace deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWorkspaces = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const workspaces = await prisma.workspaceSpace.findMany({
      where: {
        hostId: userId,
        isActive: true,
      },
      include: {
        host: true,
        streams: {
          where: {
            active: true,
          },
          take: 5, 
          orderBy: {
            createAt: "desc",
          },
        },
      },
    });

    res.json({
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};