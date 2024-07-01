import express from 'express';
import { loanController } from '../controllers/loanController';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.post('/offers/:offerId/loans', verifyToken, loanController.createLoan);
router.get('/loans/:loanId', verifyToken, loanController.getLoan);
router.patch('/loans/:loanId/status', verifyToken, loanController.updateLoanStatus);
router.get('/loans', verifyToken, loanController.getAllLoans);

export default router;