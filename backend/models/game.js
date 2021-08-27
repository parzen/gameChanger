const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const gameSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true }, // TODO: unique combine with creator
  imagePath: { type: String },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  minPlayTime: { type: Number, required: true },
  maxPlayTime: { type: Number, required: true },
  minAge: { type: Number, required: true },
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
