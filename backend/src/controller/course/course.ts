import prisma from "../../db/prisma";
export const createCourse = async (req: any, res: any) => {
    const { title, description, price } = req.body;
    try {
        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                price,
                teacher: { connect: { id: req.user.id } }
            },
            include: { teacher: true }
        });
        return res.status(201).json({ message: "Course created successfully", course: newCourse });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
export const getCourses = async (req: any, res: any) => {
    try {
        const courses = await prisma.course.findMany({
            include: { teacher: true }
        });
        return res.status(200).json({ courses });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
export const getCourseById = async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const course = await prisma.course.findUnique({
            where: { id },
            include: { teacher: true }
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({ course });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
export const updateCourse = async (req: any, res: any) => {
    const { id } = req.params;
    const { title, description, price } = req.body;
    try {
        const course = await prisma.course.findUnique({
            where: { id },
            include: { teacher: true }
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (course.teacher.id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: You are not the instructor of this course" });
        }
        const updatedCourse = await prisma.course.update({
            where: { id },
            data: { title, description, price }
        });
        return res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
export const deleteCourse = async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const course = await prisma.course.findUnique({
            where: { id },
            include: { teacher: true }
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (req.user.role !== "ADMIN" && course.teacher.id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Only admin or the instructor can delete this course" });
        }
        await prisma.course.delete({
            where: { id }
        });
        return res.status(200).json({ message: "Course deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
