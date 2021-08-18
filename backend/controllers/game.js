const Game = require("../models/game");

exports.addGame = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const game = new Game({
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId,
  });
  game
    .save()
    .then((createdGame) => {
      res.status(201).json({
        message: "Game added successfully",
        post: {
          ...createdGame,
          id: createdGame._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a game failed!",
      });
    });
};

exports.editGame = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const game = new Game({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
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
      });
    });
};

exports.getGames = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const gameQuery = Game.find();
  let fetchedGames;
  if (pageSize && currentPage) {
    gameQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  gameQuery
    .then((documents) => {
      fetchedGames = documents;
      return Game.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Games fetched succesfully!",
        games: fetchedGames,
        maxGames: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching games failed!",
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
      });
    });
};
