const express = require("express");
const router = express.Router();
const { signup, login, logout, getCurrentUser} = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", requireAuth, getCurrentUser);
module.exports = router;