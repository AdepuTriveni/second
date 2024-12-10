const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Check if all fields are provided
    if (!username || !password || !email) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists" });
        }

        // Save the user with plain-text password
        const user = new User({ username, password, email });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if all fields are provided
    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if entered password matches the stored password
        if (password !== user.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
});

module.exports = router;
