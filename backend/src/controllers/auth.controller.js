const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const asyncHandler = require('../middleware/asyncHandler');
const { generateToken } = require('../lib/utils.js');
const cloudinary = require("../lib/cloudinary.js")


/////////////
// SIGNUP ///
/////////////
// POSTMAN = http://localhost:5001/api/auth/signup
module.exports.signup = asyncHandler(async (req,res) => {
    const { fullName, email, password } = req.body;

    console.log(req.body); 
    // ERROR: checks for email/user field is filled out
    if(!fullName || !email || !password){
        console.log('I need the INPUT FIELDS')
        return res.status(400).json({ message: 'all fields are required pussyboy' })
    }

    // ERROR: pwd length error 
    if (password.length < 5 ) {
        return res.status(400).json({ message: 'PWD must be at least 5 characters pussyboy'})
    }

    // ERROR: checks if USER exists
    const user = await User.findOne({email})
    if(user) return res.status(400).json({ message: "Email already exists"});


    // Create USER (and hash PWD)
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)
    
    const newUser = new User({
        fullName,
        email, 
        password: hashedPassword
    })

    if(newUser) {
        generateToken(newUser._id, res)
        await newUser.save();

        res.status(201).json({ 
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        });

    } else {
        res.status(400).json({message: "INVALID USER DATA PUSSYBOY"})
    }
})


////////////
// LOGIN ///
////////////
module.exports.login = asyncHandler(async (req,res) => {
    const { email , password } = req.body

    // VERSION 1
    const user = await User.findOne({ email })

    // Error: Check if USER exists
    if(!user) {
        console.log('cant find user');
        return res.status(400).json({ message: "Invalid email or PWD!! I aint gonna tell you which"})
    }

    // Error: Check PWD
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        console.log('wrong password')
        return res.status(400).json({ message: "Invalid email or PWD!! I aint gonna tell you which"})
    }


    const token = generateToken(user._id, res)
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
module.exports.logout = (req, res) => {
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({ message: "See ya Bitch"})
};



/////////////////////////////
// Update Profile Picture ///
/////////////////////////////
module.exports.updateProfile = asyncHandler(async (req, res, next) => {
    
    const { profilePic } = req.body;

    // we have added the USER to the request because of PROTECTED ROUTE
    const userId = req.user._id
    if(!profilePic) {
        return res.status(400).json({message: "Profile pic is not here"});
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})
    
        res.status(200).json(updatedUser)
    } catch(error) {
        console.log('Error Updating...', error.message);
        next(error);
    }
})


////////////////
// Check Auth //
////////////////
module.exports.checkAuth = asyncHandler((req,res,next) => {
    console.log('checkAuth function called');
    res.status(200).json(req.user);
})








// AUTHENTICATION WORKFLOW
// 1. USER --> button
// 2. BUTTON --- triggers request ---> Client
// 3. Client ---> REQ to api/auth/signup or login ---> API GATETWAY
// 4. API gateway ---- creates user/check user credentials ---> Database
// then
// 5. API GATEWAY ----> JWT SERVICE
// API gateway sends backs the JWT in the cookies back to the user
