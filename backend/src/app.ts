import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { login, register } from "./controller/login/register";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verfy";
import { createCourse,deleteCourse,getCourseById,getCourses, updateCourse,} from "./controller/course/course";
import { enrollInCourse } from "./controller/course/enroll/enroll";
import { webhookHandler } from "./controller/course/enroll/payment";
dotenv.config();
const app: Application = express();
app.post("/stripe/webhook", express.raw({ type: "application/json" }), webhookHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working!" });
});

app.post("/login", login);
app.post("/register", register);
app.post("/create-course", verifyToken, createCourse);
app.post("/delete-course/:id", verifyToken, deleteCourse);
app.post("/update-course/:id", verifyToken, updateCourse);
app.get("/course/:id", getCourseById);
app.get("/courses", getCourses);
app.post("/enroll", verifyToken, enrollInCourse);
export default app;
