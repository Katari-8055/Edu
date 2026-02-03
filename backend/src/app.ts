import express, { Application, Request, Response } from "express";

const app: Application = express();

// middleware
app.use(express.json());

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Express + TypeScript running!");
});

export default app;
