import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController';

const router = Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateCartItem);
router.delete('/:productId', protect, removeFromCart);

export default router;
