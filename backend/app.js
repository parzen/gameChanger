const express = require("express");
const userRoutes = require("./routes/user");
const gameRoutes = require("./routes/game");
const passwordResetTokenRoues = require("./routes/passwordResetToken");
const app = express();

const mongoose = require("mongoose");

let dbConnect = process.env.MONGO_CONNECT;
if (process.env.NODE_ENV === "development") {
  dbConnect = process.env.MONGO_CONNECT_TEST;
}

mongoose
  .connect(dbConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connected to database failed!");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/resetpassword", passwordResetTokenRoues);
app.use(express.static("public"));

module.exports = app;
