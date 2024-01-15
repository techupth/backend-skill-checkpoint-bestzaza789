import { Router } from "express";
import { db } from "../utils/db.js";

const commentRouter = Router();

commentRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const allcomments = await collection.find({}).toArray();

    return res.json({ data: allcomments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

commentRouter.get("/:commentId", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const commentId = Number(req.params.commentId);
    const commentById = await collection
      .find({ question_id: commentId })
      .toArray();

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

commentRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("comments");
    const commentId = Number(req.params.id);

    await collection.deleteMany({ question_id: commentId });

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
