const { startGameIfReady } = require("./groupSocket");
const GameTemplate = require("../models/GameTemplateModel");
const Game = require("../models/GameModel");

module.exports = (io) => {
  const games = {};
  console.log("called 2");

  io.on("connection", (socket) => {
    console.log("New player connected");

    // Listen for groupReady events
    socket.on("groupReady", async ({ gameCode, groupCode, players }) => {
      try {
        console.log("game socket called");

        // Check if game already exists for the given groupCode
        let game = await Game.findOne({ groupCode });

        if (!game) {
          const gameTemplate = await GameTemplate.findOne({ gameCode });

          if (!gameTemplate) {
            console.error(
              "Game template not found with provided code:",
              gameCode
            );
            return;
          }

          game = new Game({
            gameTemplate: gameTemplate._id,
            groupCode: groupCode,
            players: [],
            phase: 0,
          });

          await game.save();
        }

        // Add players to the game instance
        game.players.push(...players);

        // Save changes to the database
        await game.save();

        // Emit update to all clients in the game room
        io.to(game._id).emit("updateGame", game);
        console.log(`Players joined group ${groupCode} in game ${gameCode}`);

        // Check if the game should start
        startGame(game);
      } catch (error) {
        console.error("Error handling group ready event:", error);
      }
    });

    // Function to start the game
    async function startGame(game) {
      try {
        if (game.phase === 0) {
          // Start the game only if it hasn't started
          game.phase = 1; // Example: Starting at phase 1

          await game.save();

          // Emit game started event to all clients in the game room
          io.to(game._id).emit("gameStarted", { gameId: game._id });

          console.log(`Game ${game._id} started`);

          // Save game state to database after starting
          await game.save();
        }
      } catch (error) {
        console.error("Error starting game:", error);
      }
    }

    // Handle disconnect event if needed
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      // Additional cleanup or handling can be done here
    });
  });
};
