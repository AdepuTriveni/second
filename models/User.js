const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

// No need for the password hashing middleware anymore
// You can remove the pre-save hook that hashes the password

module.exports = mongoose.model('User', UserSchema);
