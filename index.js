const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./models/UserModel');

    const app = express();
    app.use(cors());
    app.use(express.json());

    mongoose.connect("mongodb+srv://zaharieniksei:zahari123@mernapp.sljxlfh.mongodb.net/mernapp?retryWrites=true&w=majority&appName=MERNapp");


    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
        console.log('Error connecting to MongoDB:', err);
    });

    // Routes
    app.post('/users', async (req, res) => {
        console.log("HEY post");
        try {
          const { name, email, password, isActive, gameCodes } = req.body;
      
          // Create a new user instance
          const newUser = new UserModel({
            name,
            email,
            password,
            isActive,
            gameCodes
          });
      
          // Save the user to the database
          const savedUser = await newUser.save();
      
          res.status(201).json(savedUser); // Respond with the saved user object
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Server error' });
        }
    });

    app.get('/users', async (req, res) => {
        console.log("HEY get");

    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const port = 3001;

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});