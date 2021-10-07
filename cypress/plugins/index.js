/// <reference types="cypress" />

const { MongoClient } = require("mongodb");
const uri = "mongodb://mongoadmin:secret@localhost:27017/?authSource=admin";

const client = new MongoClient(uri);
async function connect() {
  // Connect the client to the server
  await client.connect();

  // Name of the DB
  return client.db("test");
}

module.exports = async (on, config) => {
  const db = await connect();
  const games = db.collection("games");

  on("task", {
    async clearGames() {
      console.log("clear games");
      await games.remove({});

      return null;
    },
  });

  const users = db.collection("users");
  on("task", {
    async clearUsers() {
      console.log("clear users");
      await users.remove({});

      return null;
    },
  });
};
