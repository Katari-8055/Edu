import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"] as string | undefined;
    if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
    }
    try {
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : authHeader.trim();
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        req.userId = decoded.id;
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized", error });
    }
};
