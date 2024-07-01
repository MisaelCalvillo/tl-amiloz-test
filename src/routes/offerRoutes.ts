import { Router } from 'express';
import { createOffer, getOffersByUserId, getOffer } from '../controllers/offerController';
import verifyToken from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';
import { calculateOfferController } from '../controllers/offerController';
import { loanController } from '../controllers/loanController';

const router = Router();

router.post('/users/:userId/offers', verifyToken, isAdmin, createOffer);
router.get('/users/:userId/offers', verifyToken, getOffersByUserId);
router.post('/offers/calculate', calculateOfferController);

router.post('/offers/:offerId/approve', verifyToken, loanController.approveLoan);
router.get('/offers/:offerId', verifyToken, getOffer);

export default router;