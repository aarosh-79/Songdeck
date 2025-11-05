import { prisma } from "../lib/prisma.js";
import { loginSchema, registerSchema } from "../validation/auth.validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Corrected isPasswordCorrect function
const isPasswordCorrect = async (password, savedPassword) => {
    return await bcrypt.compare(password, savedPassword);
};

// SIGNUP USER
export const signupuser = async (req, res) => {
    console.log("THi sis alkfjd",req.body)
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(401).json({
            message: "Validation Failed",
            errors: parsed.error.issues
        });
        console.log("this is validati", parsed.error.message)
        return
    }

    try {
        //  Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: parsed.data.email }
        });

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return
        }

        // Hash the password

        //  Create new user
        const newUser = await prisma.user.create({
            data: {
                email: parsed.data.email,
                image: parsed.data.image,
                name: parsed.data.name,
                googleId: parsed.data.googleId,
            }
        });
       
        // Return success response
        return res.status(200).json({
            message: "Signup successful",
            data: { id: newUser.id, email: newUser.email }
        });

    } catch (err) {
        console.error("Signup failed", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//  LOGIN USER
export const loginuser = async (req, res) => {
    console.log("is it here or not")
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(401).json({ message: "Validation Failed" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: parsed.data.email }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Login successful",
            data: user
        });

    } catch (err) {
        console.error("Login failed", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
