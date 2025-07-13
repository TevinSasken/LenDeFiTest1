import { Router } from 'express';
import { 
  createLoanRequest, 
  getLoans, 
  getLoanById, 
  fundLoan, 
  makePayment 
} from '../controllers/loanController';
import { authenticateToken, requireKYC } from '../middleware/auth';
import { validateRequest, loanRequestSchema } from '../middleware/validation';

const router = Router();

// All loan routes require authentication
router.use(authenticateToken);

// Loan routes
router.post('/request', requireKYC, validateRequest(loanRequestSchema), createLoanRequest);
router.get('/', getLoans);
router.get('/:id', getLoanById);
router.post('/:id/fund', requireKYC, fundLoan);
router.post('/:id/payment', makePayment);

export default router;