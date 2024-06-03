const express = require('express');

const router = express.Router();

// GET all users
router.get('/', (req, res) => {
    res.json({message: 'GET all users'});
});

// GET a single user
router.get('/:id', (req, res) => {
    res.json({message: 'GET a single user'});
});

// POST a new user
router.post('/', (req, res) => {
    res.json({message: 'POST a single user'});
});

// DELETE a new user
router.delete('/:id', (req, res) => {
    res.json({message: 'DELETE a single user'});
});

// UPDATE a new user
router.patch('/:id', (req, res) => {
    res.json({message: 'UPDATE a single user'});
});

module.exports = router;
