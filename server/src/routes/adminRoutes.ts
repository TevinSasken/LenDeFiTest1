import { Router } from 'express';
import { 
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateKYCStatus,
  updateLoanStatus,
  deactivateUser,
  exportData
} from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Admin dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/kyc', updateKYCStatus);
router.put('/users/:id/deactivate', deactivateUser);

// Loan management
router.put('/loans/:id/status', updateLoanStatus);

// Data export
router.get('/export', exportData);

export default router;