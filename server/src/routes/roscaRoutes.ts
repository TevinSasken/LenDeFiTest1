import { Router } from 'express';
import { 
  createROSCA, 
  getROSCAs, 
  getROSCAById, 
  joinROSCA, 
  contributeToROSCA,
  joinROSCAByInvite
} from '../controllers/roscaController';
import { authenticateToken, requireKYC } from '../middleware/auth';
import { validateRequest, roscaCreateSchema } from '../middleware/validation';

const router = Router();

// All ROSCA routes require authentication
router.use(authenticateToken);

// ROSCA routes
router.post('/', requireKYC, validateRequest(roscaCreateSchema), createROSCA);
router.get('/', getROSCAs);
router.get('/:id', getROSCAById);
router.post('/:id/join', requireKYC, joinROSCA);
router.post('/:id/contribute', requireKYC, contributeToROSCA);
router.post('/join/:inviteCode', requireKYC, joinROSCAByInvite);

export default router;