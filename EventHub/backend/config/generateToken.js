const jwt = require('jsonwebtoken');

// Function to generate a JWT token using the provided user ID
const generateToken = (id) => {
    // Sign the token with the user ID and a secret key, set expiration to 30 days
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: '30d' });
};

module.exports = generateToken;
