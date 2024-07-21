const express = require("express");
const playerController = require("../controllers/PlayerController");

const router = express.Router();

router.post("/player", playerController.loginPlayer);
router.put("/player/:id", playerController.updatePlayerById);

module.exports = router;
