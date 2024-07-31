const express = require("express");
const actionController = require("../controllers/ActionsCardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/action-cards", authMiddleware, actionController.addAction);
router.get("/action-cards/:id", authMiddleware, actionController.getActions);
router.put("/action-cards/:id", authMiddleware, actionController.updateAction);
// Fetch multiple questions by IDs
router.post("/get-actions", authMiddleware, actionController.getActionsByIds);

module.exports = router;
