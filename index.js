const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoutes);

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
