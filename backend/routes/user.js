const express = require("express");
const UserController = require("../controllers/user");
const { validateEmail } = require("../middleware/validate-email");
const { validatePassword } = require("../middleware/validate-password");
const router = express.Router();

router.post(
  "/signup",
  validateEmail,
  validatePassword,
  UserController.createUser
);

router.post("/login", UserController.userLogin);

module.exports = router;
