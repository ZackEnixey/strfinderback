const express = require("express");
const actionController = require("../controllers/ActionsCardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/action-cards", authMiddleware, actionController.addAction);
router.get("/action-cards/:id", authMiddleware, actionController.getActions);
router.put("/action-cards/:id", authMiddleware, actionController.updateAction);

module.exports = router;
