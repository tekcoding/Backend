import { Router } from 'express';
import { forgotPassword, login, signup, socialSignupWithGoogle, updateData, updatePassword } from './auth.services.js';

const router = Router();


router.post('/login', login);
router.post('/signup', signup);

// router.post('/logout', validateToken, logout);
router.post('/google', socialSignupWithGoogle);
router.post('/forgot-password', forgotPassword);
router.post('/update-password', updatePassword);
router.patch('/change-password', updateData);

export default router;