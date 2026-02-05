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
