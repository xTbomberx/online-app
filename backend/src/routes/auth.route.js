const express = require('express');
const { signup, login, logout, updateProfile, checkAuth } = require('../controllers/auth.controller.js')
const { protectedRoute } = require('../middleware/auth.middleware.js')

const router = express.Router();


////////////
// ROUTES //
////////////
router.post('/signup',signup )
router.post('/login',login )
router.post('/logout', logout )



// PROCTED-ROUTES (authenticated)
router.put('/update-profile', protectedRoute, updateProfile)

router.get("/check", protectedRoute, checkAuth)

module.exports = router;