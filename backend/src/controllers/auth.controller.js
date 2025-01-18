import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import asyncHandler from '../middleware/asyncHandler.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from "../lib/cloudinary.js";

/////////////
// SIGNUP ///
/////////////
// POSTMAN = http://localhost:5001/api/auth/signup
export const signup = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    console.log(req.body); 
    // ERROR: checks for email/user field is filled out
    if(!fullName || !email || !password){
        console.log('I need the INPUT FIELDS')
        return res.status(400).json({ message: 'All fields are required' });
    }

    // ERROR: pwd length error 
    if (password.length < 5 ) {
        return res.status(400).json({ message: 'Password must be at least 5 characters' });
    }

    // ERROR: checks if USER exists
    const user = await User.findOne({ email });
    if(user) return res.status(400).json({ message: "Email already exists" });

    // Create USER (and hash PWD)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
        fullName,
        email, 
        password: hashedPassword
    });

    if(newUser) {
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({ 
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        });

    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});

////////////
// LOGIN ///
////////////
export const login = asyncHandler(async (req, res) => {
    const { email , password } = req.body;

    // VERSION 1
    const user = await User.findOne({ email });

    // Error: Check if USER exists
    if(!user) {
        console.log('cant find user');
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // Error: Check PWD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('wrong password');
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, res);
    console.log('generated token:', token);

    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
    });
});

/////////////
// LOGOUT ///
/////////////
export const logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "See ya" });
};

/////////////////////////////
// Update Profile Picture ///
/////////////////////////////
export const updateProfile = asyncHandler(async (req, res, next) => {
    const { profilePic } = req.body;

    // we have added the USER to the request because of PROTECTED ROUTE
    const userId = req.user._id;
    if(!profilePic) {
        return res.status(400).json({ message: "Profile pic is not here" });
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
    
        res.status(200).json(updatedUser);
    } catch(error) {
        console.log('Error Updating...', error.message);
        next(error);
    }
});

////////////////
// Check Auth //
////////////////
export const checkAuth = asyncHandler((req, res, next) => {
    console.log('checkAuth function called');
    res.status(200).json(req.user);
});
