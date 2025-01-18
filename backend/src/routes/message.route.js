import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getUsersForSideBar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

////////////
// ROUTES //
////////////

// Authenticated Routes //
router.get('/users', protectedRoute, getUsersForSideBar);
router.get('/:id', protectedRoute, getMessages);

// send to target ID
router.post('/send/:id', protectedRoute, sendMessage);

export default router;
