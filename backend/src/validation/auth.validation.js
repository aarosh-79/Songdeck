import * as z from "zod"


export const registerSchema = z.object({
    name: z.string(),
    email: z.email(),
    image: z.string(),
    googleId: z.string(),
})

export const loginSchema = z.object({
    email: z.email()
})