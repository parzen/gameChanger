const mongoose = require("mongoose");

const passwordResetTokenSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: "3m" },
});

module.exports = mongoose.model("passwordResetToken", passwordResetTokenSchema);
