const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const gameSchema = mongoose.Schema({
  title: { type: String, required: true, unique: false },
  imagePath: { type: String },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  minPlayTime: { type: Number, required: true },
  maxPlayTime: { type: Number, required: true },
  minAge: { type: Number, required: true },
  note: { type: String },
  consider: { type: Boolean, default: true },
  gameType: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: false,
  },
});

gameSchema.index({ title: 1, creator: 1 }, { unique: true });
gameSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Game", gameSchema);
