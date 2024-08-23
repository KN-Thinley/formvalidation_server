const User = require('../models/userModel'); // Assuming the User model is in the models folder
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');


// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, age, gender, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: 'User with same email already exists' });
  }

  // Create the user
  const user = await User.create({
    fullname,
    age,
    gender,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      age: user.age,
      gender: user.gender,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });

  }
});


// Login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (user && (await user.isPasswordValid(password))) {
    res.json({
      _id: user._id,
      fullname: user.fullname,
      age: user.age,
      gender: user.gender,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, "helloworldisthejwtsecret", {
    expiresIn: '30d',
  });
};


// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      fullname: user.fullname,
      age: user.age,
      gender: user.gender,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullname = req.body.fullname || user.fullname;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullname: updatedUser.fullname,
      age: updatedUser.age,
      gender: updatedUser.gender,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
