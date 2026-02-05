import prisma from "../../db/prisma";
export const createCourse = async (req: any, res: any) => {
    const { title, description, instructorId } = req.body;
    try {
        const course = await prisma.course.create({
            data: {
                title,
                description,
                price: 0,
                teacher: { connect: { id: instructorId } }
            }
        });
        return res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
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
        const course = await prisma.course.update({
            where: { id },
            data: { title, description, price }
        });
        return res.status(200).json({ message: "Course updated successfully", course });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
 export const deleteCourse = async (req: any, res: any) => {
    const { id } = req.params;
    try {
        await prisma.course.delete({
            where: { id }
        });
        return res.status(200).json({ message: "Course deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};