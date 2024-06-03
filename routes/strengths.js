const express = require("express");
const strengthCardController = require("../controllers/StrengthCardController");

const router = express.Router();

router.post("/strength-cards", strengthCardController.addStrengthCard);
router.get(
  "/strength-cards/clifton",
  strengthCardController.getCliftonStrengths
);
router.get("/strength-cards/gallup", strengthCardController.getGallupStrengths);

module.exports = router;
