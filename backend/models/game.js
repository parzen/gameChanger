const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const gameSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  thumbnail: { type: String },
  image: { type: String },
  minPlayers: { type: String, required: true },
  maxPlayers: { type: String, required: true },
  minPlayTime: { type: String, required: true },
  maxPlayTime: { type: String, required: true },
  minAge: { type: String, required: true },
  note: { type: String },
  gameType: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

gameSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Game", gameSchema);
