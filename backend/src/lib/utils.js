const jwt = require('jsonwebtoken')

module.exports.generateToken = (userId, res) => {
    
    // PAYLOAD //
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"1d"
    })
    // res.cookie('token', token
    res.cookie('jwt', token, {
        maxAge: 1 * 24 *60 * 60 * 1000,
        httpOnly: true, // prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF atackss cross-site request forgery attacks
        secure: process.env.NODE_ENV !== 'development'
    })

    return token;
}