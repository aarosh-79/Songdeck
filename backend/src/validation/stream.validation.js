import { z } from "zod";

export const streamSchema = z.object({
  type: z.enum(["Spotify", "Youtube"]),
  url: z.string().url("URL must be a valid URL"),
  extractedId: z.string(),
  title: z.string().optional().default(""),
  smallImg: z.string().optional().default(""),
  bigImg: z.string().optional().default(""),
});

export const createStreamSchema = z.object({
  body: streamSchema.omit({ title: true, smallImg: true, bigImg: true }).extend({
    title: z.string().optional(),
    smallImg: z.string().optional(),
    bigImg: z.string().optional(),
  }),
  params: z.object({
    spaceId: z.string().uuid("Space ID must be a valid UUID"),
  }),
});

export const updateStreamSchema = z.object({
  body: streamSchema
    .partial()
    .extend({
      active: z.boolean().optional(),
    }),
  params: z.object({
    id: z.string().uuid("Stream ID must be a valid UUID"),
  }),
});

export const upvoteSchema = z.object({
  body: z.object({
    streamId: z.string().uuid("Stream ID must be a valid UUID"),
  }),
});