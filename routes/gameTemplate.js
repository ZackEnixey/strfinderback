const express = require("express");
const gameTemplateController = require("../controllers/GameTemplateController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/game-template",
  authMiddleware,
  gameTemplateController.createGame
);
router.get(
  "/game-template/:id",
  authMiddleware,
  gameTemplateController.getGames
);
router.put(
  "/game-template/:id",
  authMiddleware,
  gameTemplateController.updateGame
);
router.delete(
  "/game-template/:id",
  authMiddleware,
  gameTemplateController.deleteGame
);

module.exports = router;
