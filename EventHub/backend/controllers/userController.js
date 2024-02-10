const generateToken = require('../config/generateToken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

// User registration
const userRegister = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    } else {
      // Create a new user
      const user = await User.create({
        name,
        email,
        password,
        role,
      });

      // Respond with user details and a token
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role:user.role,
        token: generateToken(user._id),
        success: true,
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

// User authentication
const authRegister = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))){
      // Respond with user details if authentication is successful
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role:user.role,
        token: generateToken(user._id),
        location: user.location,
      });
    } else {
      // Respond with an error message if authentication fails
      return res.status(401).json({
        message: 'Invalid password',
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

const getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
   
    if (user) {
      // Update user details
    
      // Respond with updated user details and a new token
      return res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
})
// Update user details
const updatedUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, location } = req.body;

    if (user) {
      // Update user details
      user.name = name;
      user.email = email;
      user.location = location;

      // Save the updated user
      const updatedUser = await user.save();

      // Respond with updated user details and a new token
      return res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        location: updatedUser.location,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

// Export the functions to be used as route handlers
module.exports = { userRegister, authRegister, updatedUser };
