const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body); // Log request body
    const user = await User.findOne({ username: req.body.username });
    console.log('User found:', user); // Log found user

    if (!user) return res.status(400).send({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(req.body.password);
    console.log('Password match:', isMatch); // Log password match result

    if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    console.log('Token generated:', token); // Log generated token

    res.send({ token });
  } catch (error) {
    console.error('Login error:', error); // Log the error
    res.status(500).send(error);
  }
});

module.exports = router;