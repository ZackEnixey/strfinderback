const express = require("express");
const userController = require("../controllers/UserController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/users", authMiddleware, userController.createUser);
router.get("/users", authMiddleware, userController.getAllUsers);
router.get("/users/:id", authMiddleware, userController.getUserById);
router.put("/users/:id", authMiddleware, userController.updateUserById);
router.delete("/users/:id", authMiddleware, userController.deleteUserById);

module.exports = router;
