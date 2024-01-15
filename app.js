import express from "express";
import { client } from "./utils/db.js";
import questionRouter from "./apps/questions.js";
import commentRouter from "./apps/comments.js";

async function init() {
  const app = express();
  const port = 4000;
  await client.connect();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use("/questions", questionRouter);
  app.use("/comments", commentRouter);

  app.get("/", (req, res) => {
    return res.json("Hello Skill Checkpoint #2");
  });

  app.get("*", (req, res) => {
    return res.status(404).json("Not found");
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

init();
