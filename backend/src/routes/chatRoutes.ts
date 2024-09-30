// backend/src/routes/chatRoutes.ts
import { Router } from 'express';
import { getAIResponse } from '../controllers/chatController';

const router = Router();

router.post('/', getAIResponse);

export default router;
