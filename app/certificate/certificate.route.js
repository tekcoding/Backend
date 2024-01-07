import { Router } from 'express';
import { getCertificate } from './certificate.services.js';

const router = Router();

router.get('/:certId', getCertificate);

export default router;