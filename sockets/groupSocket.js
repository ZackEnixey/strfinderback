const Group = require("../models/GroupModel");
const GameTemplate = require("../models/GameTemplateModel");
const Game = require("../models/GameModel");
const Player = require("../models/Player");

let playersInGroups = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New group socket connected");

    socket.on("getGroups", async (gameCode) => {
      try {
        const groups = await Group.find({ gameCode });
        socket.emit("groupsData", groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
        socket.emit("groupError", { message: "Error fetching groups" });
      }
    });

    socket.on("joinGroup", async ({ player, gameCode }) => {
      try {
        // Find all groups with the given gameCode
        const groups = await Group.find({ gameCode }).sort("groupCode");

        let group;
        for (let g of groups) {
          if (g.players.find((p) => p.email === player.email)) {
            // Player is already in this group
            socket.join(g.groupCode); // Ensure the player is in the correct room
            io.to(g.groupCode).emit("playerJoined", {
              player,
              groupCode: g.groupCode,
            });
            socket.emit("groupData", g); // Send the group data to the player
            return;
          }
          if (!group && g.players.length < 6) {
            group = g; // Find the first group with less than 6 players
          }
        }

        if (!group) {
          // Create a new group if no suitable group is found
          let groupIndex = groups.length + 1;
          let groupCode = `${gameCode}${groupIndex}`;
          group = new Group({
            groupCode,
            gameCode,
            players: [],
          });

          // Save the new group to the database
          await group.save();
        }

        // Add player to the group
        group.players.push(player);
        playersInGroups[player.nickName] = group.groupCode; // Track player in this group
        socket.join(group.groupCode);

        // Save the updated group to the database
        await group.save();

        io.to(group.groupCode).emit("playerJoined", {
          player,
          groupCode: group.groupCode,
        });
        console.log(
          `Player ${player.nickName} joined group ${group.groupCode}`
        );

        // Update all clients with the new group data
        io.emit("groupsData", await Group.find({ gameCode }));
      } catch (error) {
        console.error("Error joining group:", error);
        socket.emit("groupError", { message: "Error joining group" });
      }
    });

    socket.on("updateGroup", async ({ player, targetGroupCode }) => {
      try {
        const targetGroup = await Group.findOne({ groupCode: targetGroupCode });

        if (!targetGroup || targetGroup.players.length >= 6) {
          socket.emit("groupError", {
            message: "Target group is full or does not exist",
          });
          return;
        }

        const currentGroupCode = playersInGroups[player.nickName];
        if (currentGroupCode === targetGroupCode) {
          socket.emit("groupError", {
            message: "You are already in this group",
          });
          return;
        }

        const currentGroup = await Group.findOne({
          groupCode: currentGroupCode,
        });
        if (currentGroup) {
          currentGroup.players = currentGroup.players.filter(
            (p) => p.email !== player.email
          );
          await currentGroup.save();
          io.to(currentGroup.groupCode).emit("playerLeft", {
            playerId: player.id,
            groupCode: currentGroup.groupCode,
          });
        }

        // Add player to the target group
        targetGroup.players.push(player);
        playersInGroups[player.nickName] = targetGroup.groupCode;
        socket.join(targetGroup.groupCode);
        await targetGroup.save();

        io.to(targetGroup.groupCode).emit("playerJoined", {
          player,
          groupCode: targetGroup.groupCode,
        });
        console.log(
          `Player ${player.nickName} moved to group ${targetGroup.groupCode}`
        );
        // Update all clients with the new group data
        io.emit(
          "groupsData",
          await Group.find({ gameCode: targetGroup.gameCode })
        );
      } catch (error) {
        console.error("Error updating group:", error);
        socket.emit("groupError", { message: "Error updating group" });
      }
    });

    socket.on("playerReady", async ({ groupCode, playerId }) => {
      try {
        await startGameIfReady(groupCode, playerId);
      } catch (error) {
        console.error("Error marking player as ready:", error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Group socket disconnected");
      const playerId = Object.keys(socket.rooms).find(
        (id) => playersInGroups[id]
      );
      if (playerId) {
        const groupCode = playersInGroups[playerId];
        const group = await Group.findOne({ groupCode });
        if (group) {
          group.players = group.players.filter(
            (player) => player.id !== playerId
          );
          delete playersInGroups[playerId];
          io.to(groupCode).emit("playerLeft", { playerId, groupCode });
          console.log(`Player ${playerId} left group ${groupCode}`);

          // Remove player from the database
          await group.save();

          // Update all clients with the updated group data
          io.emit("groupsData", await Group.find({ gameCode: group.gameCode }));
        }
      }
    });
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async function startGameIfReady(groupCode, playerId) {
    try {
      const group = await Group.findOne({ groupCode });
      if (!group) {
        console.error("Group not found with provided code:", groupCode);
        return;
      }

      const gameCode = group.gameCode;
      io.to(groupCode).emit("startGame", { groupCode });
      console.log("game socket called");

      let game = await Game.findOne({ groupCode });
      if (!game) {
        const gameTemplate = await GameTemplate.findOne({
          gameTemplateId: gameCode,
        });
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

      const player = await Player.findById(playerId);
      if (!player) {
        console.error("Player not found with provided id:", playerId);
        return;
      }

      game.players.push(player);

      await game.save();

      io.to(game._id).emit("updateGame", game);
      console.log(
        `Player ${playerId} joined group ${groupCode} in game ${gameCode}`
      );
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }
};
