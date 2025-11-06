import { prisma } from "../lib/prisma.js";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import jwt from "jsonwebtoken";
import { z } from "zod";

const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.TOKEN_SECRET, { expiresIn: "7d" });
};

// Sign up a new user
export const signupuser = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(401).json({
        message: "Validation Failed",
        errors: parsed.error.issues,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        googleId: parsed.data.googleId,
      },
    });

    const token = createToken(newUser.id, newUser.email);

    res.status(200).json({
      message: "Signup successful",
      data: { user: newUser, token },
    });
  } catch (error) {
    next(error);
  }
};

// Log in an existing user
export const loginuser = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(401).json({ message: "Validation Failed" });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = createToken(user.id, user.email);

    res.status(200).json({
      message: "Login successful",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        streams: {
          where: {
            active: true,
          },
          include: {
            upvotes: true,
          },
        },
        addedStreams: {
          where: {
            active: true,
          },
          include: {
            upvotes: true,
          },
        },
        upvotes: true,
        hostedSpaces: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate the input
    const validation = z.object({
      name: z.string().min(1, "Name must be at least 1 character").max(255, "Name must be less than 255 characters").optional(),
      email: z.string().email("Email must be a valid email").optional(),
    }).safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { name, email } = validation.data;

    // Check if email already exists for another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id }, // Exclude the current user
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: name || undefined,
        email: email || undefined,
      },
    });

    res.json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (deactivate)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Instead of deleting, deactivate the user by setting email to include a suffix
    const deactivationSuffix = `_${Date.now()}`;
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: { set: `${id}${deactivationSuffix}@deactivated.com` },
        name: "Deactivated User",
      },
    });

    res.json({
      message: "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        streams: {
          where: {
            active: true,
          },
          take: 5, // Only include last 5 streams
        },
        addedStreams: {
          where: {
            active: true,
          },
          take: 5, // Only include last 5 added streams
        },
        hostedSpaces: {
          where: {
            isActive: true,
          },
          take: 5, // Only include last 5 hosted spaces
        },
      },
      orderBy: { name: "asc" },
    });

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's hosted workspaces
export const getUserHostedWorkspaces = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const workspaces = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        hostedSpaces: {
          where: {
            isActive: true,
          },
          include: {
            streams: {
              where: {
                active: true,
              },
              take: 5,
            },
          },
        },
      },
    });

    res.json({
      data: workspaces?.hostedSpaces || [],
    });
  } catch (error) {
    next(error);
  }
};
