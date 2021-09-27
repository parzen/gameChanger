const Game = require("../models/game");

exports.addGame = (req, res, next) => {
  const game = new Game({
    title: req.body.title,
    imagePath: req.body.imagePath,
    minPlayers: req.body.minPlayers,
    maxPlayers: req.body.maxPlayers,
    minPlayTime: req.body.minPlayTime,
    maxPlayTime: req.body.maxPlayTime,
    minAge: req.body.minAge,
    note: req.body.note,
    consider: req.body.consider,
    gameType: req.body.gameType,
    creator: req.userData.userId,
  });
  game
    .save()
    .then((createdGame) => {
      res.status(201).json({
        message: "Game added successfully!",
        game: {
          ...createdGame,
          id: createdGame._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Adding a game failed!",
        dberror: error.message,
      });
    });
};

exports.editGame = (req, res, next) => {
  const game = new Game({
    _id: req.body.id,
    title: req.body.title,
    imagePath: req.body.imagePath,
    minPlayers: req.body.minPlayers,
    maxPlayers: req.body.maxPlayers,
    minPlayTime: req.body.minPlayTime,
    maxPlayTime: req.body.maxPlayTime,
    minAge: req.body.minAge,
    note: req.body.note,
    consider: req.body.consider,
    gameType: req.body.gameType,
    creator: req.userData.userId,
  });
  Game.updateOne({ _id: req.params.id, creator: req.userData.userId }, game)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update game!",
        dberror: error.message,
      });
    });
};

exports.getGames = (req, res, next) => {
  const gameQuery = Game.find({ creator: req.userData.userId });
  gameQuery
    .then((fetchedGames) => {
      res.status(200).json({
        message: "Games fetched succesfully!",
        games: fetchedGames,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching games failed!",
        dberror: error.message,
      });
    });
};

exports.getGame = (req, res, next) => {
  Game.findById(req.params.id)
    .then((game) => {
      if (game) {
        res.status(200).json(game);
      } else {
        res.status(404).json({ message: "Game not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching games failed!",
        dberror: error.message,
      });
    });
};

exports.deleteGame = (req, res, next) => {
  Game.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching games failed!",
        dberror: error.message,
      });
    });
};

exports.getGamesToPlay = (req, res, next) => {
  const players = parseInt(req.query.players);
  const maxPlayTimeInput = parseInt(req.query.maxPlayTime);
  const minAgeInput = parseInt(req.query.minAge);

  Game.find({
    creator: req.userData.userId,
    maxPlayers: { $gte: players },
    minPlayers: { $lte: players },
    minPlayTime: { $lte: maxPlayTimeInput },
    minAge: { $gte: minAgeInput },
    consider: true,
  })
    .limit(10)
    .then((fetchedGames) => {
      res.status(200).json({
        message: "Games fetched successfully!",
        games: fetchedGames,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Get games to play failed!",
        dberror: error.message,
      });
    });
};
