import { Router } from 'express';
import { addVerificationCertificate, forgotPassword, login, signup, updatePassword } from './admin.services.js';
import { verifyAdmin } from '../middleware/verifyToken.js';

const router = Router();

router.post('/login', login);
// router.post('/signup', signup);
router.post('/forgot-password', forgotPassword);
router.post('/update-password', updatePassword);
router.post('/add-verification-certificate',verifyAdmin, addVerificationCertificate);

export default router;