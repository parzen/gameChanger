const express = require("express");
const userRoutes = require("./routes/user");
const gameRoutes = require("./routes/game");

const app = express();

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://adrian:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.ewlak.mongodb.net/node-angular?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);

module.exports = app;
