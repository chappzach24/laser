const mongoose = require('mongoose');
const Schema = mongoose.Schema;

    const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    });

const User = mongoose.model('User', userSchema);
module.exports = User;


// Create a New User: POST http://localhost:5000/api/users
// Get All Users: GET http://localhost:5000/api/users
// Get a User by ID: GET http://localhost:5000/api/users/:id
// Update a User by ID: PUT http://localhost:5000/api/users/:id
// Delete a User by ID: DELETE http://localhost:5000/api/users/:id