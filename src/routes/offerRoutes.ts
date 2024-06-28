import { Router } from 'express';
import { createOffer, getOffersByUserId } from '../controllers/offerController';
import verifyToken from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';
import { calculateOfferController } from '../controllers/offerController';

const router = Router();

router.post('/users/:userId/offers', verifyToken, isAdmin, createOffer);
router.get('/users/:userId/offers', verifyToken, getOffersByUserId);
router.post('/offers/calculate', calculateOfferController);

export default router;