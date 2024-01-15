import { Router } from "express";
import { db } from "../utils/db.js";

const commentRouter = Router();

commentRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const allcomments = await collection.findOne({}).toArray();

    return res.json({ data: allcomments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

commentRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const commentId = Number(req.params.id);
    const commentById = await collection.findOne({ question_id: commentId });

    return res.json({ data: commentById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

commentRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const lastComment = await collection.findOne({}, { sort: { id: -1 } });
    const newCommentId = lastComment ? lastComment.id + 1 : 1;
    const commentData = {
      id: newCommentId,
      ...req.body,
      created_at: new Date(),
    };

    const newCommentData = await collection.insertOne(commentData);

    return res.json({
      message: `Comment Id ${newCommentData.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

commentRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const newCommentData = { ...req.body, modified_at: new Date() };
    const commentId = Number(req.params.id);

    await collection.updateOne(
      {
        id: commentId,
      },
      {
        $set: newCommentData,
      }
    );
    return res.json({
      message: `Comment id: ${commentId} has been updated successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

commentRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const commentId = Number(req.params.id);

    await collection.deleteMany({ id: commentId });

    return res.json({
      message: `Question id: ${commentId} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

export default commentRouter;
