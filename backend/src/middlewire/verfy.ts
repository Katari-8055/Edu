import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyToken = (req: any, res: any, next: any) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized", error });
    }
};
