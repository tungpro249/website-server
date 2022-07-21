const express = require("express");
const userController = require("../controller/usersController");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/refresh_token", userController.refreshToken);
router.get("/logout", userController.logout);

module.exports = router;
