import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
    id: string;
    role: string;
}

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Attach user info to request
        (req as any).user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized - Invalid token"
        });
    }
};
