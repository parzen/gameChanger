const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        return res.status(201).json({
          message: "User created",
          result: result,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Invalid authentication credentials!",
          dberror: error.message,
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed: Invalid username or password",
      });
    }
    fetchedUser = user;
    bcrypt.compare(req.body.password, user.password, (err, success) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      if (success) {
        const token = jwt.sign(
          { userId: fetchedUser._id },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
        });
      } else {
        return res.status(401).json({
          message: "Auth failed: Invalid username or password",
        });
      }
    });
  });
};
