const express = require('express');
const { userRegister, authRegister, updatedUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Create an instance of the Express Router
const router = express.Router();

// Route for user registration (POST /api/users)
router.post('/', userRegister);

// Route for user login (POST /api/users/login)
router.post('/login', authRegister);

// Route for updating user details (PUT /api/users/update-user)
// This route is protected and requires authentication (using the 'protect' middleware)
router.put('/update-user', protect, updatedUser);

module.exports = router;
