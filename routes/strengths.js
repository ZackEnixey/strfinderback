const express = require("express");
const strengthCardController = require("../controllers/StrengthCardController");

const router = express.Router();

router.post("/strength-cards", strengthCardController.addStrengthCard);
router.get("/strength-cards", strengthCardController.getStrengths);

module.exports = router;
