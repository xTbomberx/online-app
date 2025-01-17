// TOKEN VALIDATION
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const asyncHandler = require('../middleware/asyncHandler');


// PAYLOAD within the JWT/COOKIe = const token = jwt.sign({userId}
// TOKEN VALIDATION

module.exports.protectedRoute = asyncHandler(async (req, res, next) => {

    // STEP 1 - EXTRACT TOKEN
    const token = req.cookies.jwt; // Ensure the cookie name matches
    //console.log('Token from cookie:', req.cookies.jwt); // Debugging statement
    // console.log('Token from cookie:', req.cookies.jwt);

    // STEP 2 - TOKEN prescence CHECK
    if (!token) {
        console.log('No token provided biiiiitch'); // Personal message for debugging
        return res.status(401).json({ message: "Unauthorized - Yeah bitch u aint logged in yet" });
    }

    // STEP 3 - TOKEN verification (decodes TOKEN)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // = decoded.userId
        if (!decoded) {
            console.log('Invalid token'); // Personal message for debugging
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // STEP 4 - USER retrieval from DB (using the USER-ID from the TOKEN)
        const user = await User.findById(decoded.userId).select("-password"); // returns all fields except PWD field to the token
        if (!user) {
            console.log('User not found'); // Personal message for debugging
            return res.status(404).json({ message: "User not found" });
        }

        // STEP 5 - ATTACHING the the USER info to the REQUEST
        req.user = user; // user.email, user.fullName, user.profilepic
        console.log('Middleware executed - User:', user.email, user.fullName, user.profilePic); // Single logging statement
        // console.log('///////////////////////////////////')
        // console.log('User email:', user.email); // Personal message for debugging
        // console.log('User fullname:', user.fullName);
        // console.log('User profilePic:', user.profilePic);
        // console.log('///////////////////////////////////')

        // STEP 6 - passes the INFORMation to NEXT middleware
        next();
    } catch (error) {
        console.log('Token validation error:', error.message); // Personal message for debugging
        next(error); // Pass the error to the custom error handler
    }
});
