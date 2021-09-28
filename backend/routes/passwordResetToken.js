const express = require("express");
const PasswordResetTokenController = require("../controllers/passwordResetToken");
const { validatePassword } = require("../middleware/validate-password");
const router = express.Router();

router.post(
  "/req-reset-password",
  PasswordResetTokenController.requestResetPassword
);

router.post(
  "/new-password",
  validatePassword,
  PasswordResetTokenController.newPassword
);

router.post(
  "/valid-password-token",
  PasswordResetTokenController.validPasswordToken
);

module.exports = router;
