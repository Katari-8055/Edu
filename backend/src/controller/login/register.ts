import prisma from "../../db/prisma";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req: any, res: any) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "7d" }
        );
        const { password: _password, ...safeUser } = user;
        return res.status(200).json({ message: "Login successful", user: safeUser, token: token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const register = async (req: any, res: any) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = await prisma.user.create({
            data: { email, password, name, role: "STUDENT" }
        });
        return res.status(201).json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};