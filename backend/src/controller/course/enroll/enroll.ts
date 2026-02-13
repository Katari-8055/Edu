import { createPaymentIntent } from "./payment";
import { Request, Response } from "express";
import prisma from "../../../db/prisma";
declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}
export const enrollInCourse = async (req: Request, res: Response) => {
    const { courseId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId,
                },
            },
        });
        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.price > 0) {
            return createPaymentIntent(req, res);
        }
        await prisma.enrollment.create({
            data: {
                userId: userId,
                courseId: courseId,
            },
        });
        res.json({ message: "Enrolled successfully" });
    } catch (error) {
        console.error("Error enrolling in course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

