const passwordResetToken = require("../models/passwordResetToken");
const User = require("../models/user");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports = {
  async requestResetPassword(req, res) {
    if (!req.body.email) {
      return res.status(500).json({ message: "Email is required!" });
    }
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(409).json({ message: "Email does not exist!" });
    }
    var resettoken = new passwordResetToken({
      user: user._id,
      resetToken: crypto.randomBytes(16).toString("hex"),
    });
    resettoken.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      passwordResetToken
        .find({ user: user._id, resetToken: { $ne: resettoken.resetToken } })
        .remove()
        .exec();
      res.status(200).json({ message: "Reset Password successfully." });
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 465,
        auth: {
          user: process.env.MAIL_AD,
          pass: process.env.MAIL_PW,
        },
      });

      const env = process.env.NODE_ENV;
      const config = env
        ? require("../config.json")[env]
        : require("./config.json")["development"];

      var mailOptions = {
        to: user.email,
        from: process.env.MAIL_AD,
        subject: "Game Changer Password Reset",
        text:
          "You are receiving this because you have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          config.FRONTEND_URL +
          "/pw-reset/response-reset-password/" +
          resettoken.resetToken +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
      transporter.sendMail(mailOptions, (err, info) => {});
    });
  },

  async validPasswordToken(req, res) {
    if (!req.body.resettoken) {
      return res.status(500).json({ message: "Token is required!" });
    }
    const resetToken = await passwordResetToken.findOne({
      resetToken: req.body.resettoken,
    });
    if (!resetToken) {
      return res.status(409).json({ message: "Invalid URL!" });
    }
    User.findOneAndUpdate({ _id: resetToken.user })
      .then(() => {
        res.status(200).json({ message: "Token verified successfully!" });
      })
      .catch((err) => {
        return res.status(500).send({ msg: err.message });
      });
  },

  async newPassword(req, res) {
    passwordResetToken.findOne(
      { resetToken: req.body.resettoken },
      function (err, token) {
        if (!token) {
          return res.status(409).json({ message: "Token has expired!" });
        }

        User.findOne({ _id: token.user }, function (err, user) {
          if (!user) {
            return res.status(409).json({ message: "User does not exist!" });
          }
          return bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res
                .status(400)
                .json({ message: "Error hashing password!" });
            }
            user.password = hash;
            user.save(function (err) {
              if (err) {
                return res
                  .status(400)
                  .json({ message: "Error resetting password!" });
              } else {
                token.remove();
                return res
                  .status(201)
                  .json({ message: "Password reset successfully!" });
              }
            });
          });
        });
      }
    );
  },
};
