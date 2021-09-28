const express = require("express");
const UserController = require("../controllers/user");
const { validateUser } = require("../middleware/validate-user");
const router = express.Router();

router.post("/signup", validateUser, UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;
