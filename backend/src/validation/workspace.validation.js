import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  hostId: z.string().uuid("Host ID must be a valid UUID"),
  isActive: z.boolean().optional().default(true),
});

export const createWorkspaceSchema = z.object({
  body: workspaceSchema.omit({ isActive: true }),
});

export const updateWorkspaceSchema = z.object({
  body: workspaceSchema.partial(),
  params: z.object({
    id: z.string().uuid("Workspace ID must be a valid UUID"),
  }),
});

export const getWorkspaceSchema = z.object({
  params: z.object({
    id: z.string().uuid("Workspace ID must be a valid UUID"),
  }),
});