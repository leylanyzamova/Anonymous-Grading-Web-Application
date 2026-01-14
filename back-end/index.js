import express from "express";
import env from "dotenv";
import cors from "cors";

import DB_Init from "./entities/DbInit.js";
import createDbRouter from "./Routes/CreateDbRoute.js";
import userRouter from "./Routes/UserRouter.js";
import projectRouter from "./Routes/ProjectsRouter.js";
import userProjectRouter from "./Routes/UserProjectRoute.js";
import permissionRouter from "./Routes/PermissionRoute.js";
import gradeRouter from "./Routes/GradeRoute.js";
import deliverableRouter from "./Routes/DeliverablesRoute.js";

env.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://anonymous-grading-web-application-1.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 IMPORTANT: wait for DB before starting server
(async () => {
  await DB_Init();

  app.use("/api", createDbRouter);
  app.use("/api", userRouter);
  app.use("/api", projectRouter);
  app.use("/api", userProjectRouter);
  app.use("/api", permissionRouter);
  app.use("/api", gradeRouter);
  app.use("/api", deliverableRouter);

  const port = process.env.PORT || 8001;
  app.listen(port, "0.0.0.0", () => {
    console.log("API is running at " + port);
  });
})();
