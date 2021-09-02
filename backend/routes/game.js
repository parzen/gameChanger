const express = require("express");
const GameController = require("../controllers/game");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// Erster Parameter ist ein Filter, z.B. Pfad. Nur
// dieser durchläuft die middleware
router.get("", checkAuth, GameController.getGames);

router.get("/game/:id", GameController.getGame);

router.post("", checkAuth, GameController.addGame);

router.put("/:id", checkAuth, GameController.editGame);

router.delete("/:id", checkAuth, GameController.deleteGame);

router.get("/play", checkAuth, GameController.getGamesToPlay);

module.exports = router;
