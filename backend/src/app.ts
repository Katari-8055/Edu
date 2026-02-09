import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { login, register } from "./controller/login/register";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verfy";
import { createPost } from "./controller/posts/post";
dotenv.config();
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working!" });
});

app.post("/login", login);
app.post("/register", register);
app.post("/post", verifyToken, createPost);
export default app;
