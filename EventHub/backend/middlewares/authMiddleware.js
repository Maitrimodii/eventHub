const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

// Middleware to protect routes by checking for a valid JWT token
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the request headers contain an Authorization header starting with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            const decoded = await jwt.verify(token, process.env.JWT_TOKEN);

            // Attach the user information (excluding password) to the request object
            req.user = await User.findById(decoded.id).select('-password');

            // Continue to the next middleware
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };
