import { Post } from "../../../mongo/schema";
export const createPost = async (req: any, res: any) => {
    const { courseId, content } = req.body;
    try {
        const newPost = await Post.create({
            courseId,
            content,
            user: { id: req.user.id, name: req.user.name }
        });
        return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getPosts = async (req: any, res: any) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return res.status(200).json({ posts });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getPostById = async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const updatePost = async (req: any, res: any) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: You are not the author of this post" });
        }

        post.content = content ?? post.content;
        const updatedPost = await post.save();

        return res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const deletePost = async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: You are not the author of this post" });
        }
        await Post.findByIdAndDelete(id);
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};