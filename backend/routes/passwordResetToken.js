const express = require("express");
const PasswordResetTokenController = require("../controllers/passwordResetToken");
const router = express.Router();

router.post("/req-reset-password", PasswordResetTokenController.requestResetPassword);

router.post("/new-password", PasswordResetTokenController.newPassword);

router.post(
  "/valid-password-token",
  PasswordResetTokenController.validPasswordToken
);

module.exports = router;
