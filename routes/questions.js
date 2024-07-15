const express = require("express");
const questionsController = require("../controllers/QuestionCardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/question-cards", authMiddleware, questionsController.addQuestion);
router.get(
  "/question-cards/:id",
  authMiddleware,
  questionsController.getQuestions
);
router.put(
  "/question-cards/:id",
  authMiddleware,
  questionsController.updateQuestion
);

module.exports = router;
