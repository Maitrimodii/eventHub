const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: validator.isEmail, 
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        enum:['organiser','attendee'],
        default:'attendee',
    },
}, { timestamps: true });

// Middleware to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    // Check if the password field is modified before hashing
    if (!this.isModified('password')) {
        return next(); // If not modified, proceed to the next middleware
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next(); // Proceed to the next middleware
});

// Method to compare entered password with the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw new Error('Password comparison error');
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
