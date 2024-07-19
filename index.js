const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const gameSocket = require("./sockets/gameSocket");
const groupSocket = require("./sockets/groupSocket");
const userRoutes = require("./routes/users");
const strengthRoutes = require("./routes/strengths");
const solutionRoutes = require("./routes/solutions");
const loginRouter = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const actionsRoutes = require("./routes/actions");
const gameTemplateRoutes = require("./routes/gameTemplate");
const playerRoutes = require("./routes/players");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"],
  },
});
io.listen(4000);

app.use(cors());
app.use(express.json());
app.use(
  strengthRoutes,
  userRoutes,
  loginRouter,
  solutionRoutes,
  questionRoutes,
  actionsRoutes,
  gameTemplateRoutes,
  playerRoutes
);
// Socket.IO
groupSocket(io);
gameSocket(io);

const PORT = process.env.PORT;
const MONGODB_URI = process.env.DATABASE_URL;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
