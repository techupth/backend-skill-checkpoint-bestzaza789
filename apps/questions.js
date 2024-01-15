import { Router } from "express";
import { db } from "../utils/db.js";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  try {
    const name = req.query.keywords;
    const category = req.query.category;
    const query = {};
    if (name) {
      query.name = new RegExp(name, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }
    const collection = db.collection("questions");
    const allQuestions = await collection.find(query).limit(10).toArray();

    return res.json({ data: allQuestions });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = Number(req.params.id);
    const questionById = await collection.findOne({ id: questionId });

    return res.json({ data: questionById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const lastQuestion = await collection.findOne({}, { sort: { id: -1 } });
    const newQuestionId = lastQuestion ? lastQuestion.id + 1 : 1;
    const questionData = {
      id: newQuestionId,
      ...req.body,
      created_at: new Date(),
    };

    const newQuestionData = await collection.insertOne(questionData);

    return res.json({
      message: `Question Id ${newQuestionData.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const newQuestionData = { ...req.body, modified_at: new Date() };
    const questionId = Number(req.params.id);

    await collection.updateOne(
      {
        id: questionId,
      },
      {
        $set: newQuestionData,
      }
    );
    return res.json({
      message: `Question id: ${questionId} has been updated successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = Number(req.params.id);

    await collection.deleteOne({ id: questionId });

    return res.json({
      message: `Question id: ${questionId} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

export default questionRouter;
