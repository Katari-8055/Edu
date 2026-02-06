import prisma from "./../db/prisma";
export const getProfile = async (req: any, res: any) => {
    const userId = req.query.userId ?? req.query.id ?? req.body?.id;
    if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "Missing or invalid user id" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                courses: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        teacher: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                } 
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
