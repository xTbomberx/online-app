import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

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

export default router;