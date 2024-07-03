const express = require("express");
const strengthCardController = require("../controllers/StrengthCardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/strength-cards",
  authMiddleware,
  strengthCardController.addStrengthCard
);
router.get(
  "/strength-cards/:id",
  authMiddleware,
  strengthCardController.getStrengths
);

module.exports = router;
