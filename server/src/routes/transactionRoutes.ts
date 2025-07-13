import { Router } from 'express';
import { 
  getTransactions, 
  getTransactionById, 
  createTransaction, 
  updateTransactionStatus,
  getTransactionSummary
} from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All transaction routes require authentication
router.use(authenticateToken);

// Transaction routes
router.get('/', getTransactions);
router.get('/summary', getTransactionSummary);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id/status', updateTransactionStatus);

export default router;