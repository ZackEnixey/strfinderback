const express = require("express");
const solutionCardController = require("../controllers/SolutionCardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/solution-cards",
  authMiddleware,
  solutionCardController.addSolutionCard
);
router.get(
  "/solution-cards/:id",
  authMiddleware,
  solutionCardController.getSolutions
);
router.put(
  "/solution-cards/:id",
  authMiddleware,
  solutionCardController.updateSolutionCard
);
router.post(
  "/get-solutions",
  authMiddleware,
  solutionCardController.getSolutionsByIds
);

module.exports = router;
