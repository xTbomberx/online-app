const express = require('express');
const { protectedRoute } = require('../middleware/auth.middleware.js')
const { getUsersForSideBar, getMessages, sendMessage } = require('../controllers/message.controller.js')



const router = express.Router();



////////////
// ROUTES //
////////////


// Authenticated Routes //
router.get('/users', protectedRoute, getUsersForSideBar)
router.get('/:id', protectedRoute, getMessages)


// send to target ID
router.post("/send/:id", protectedRoute, sendMessage)














module.exports = router;