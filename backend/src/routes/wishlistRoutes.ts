import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../controllers/wishlistController';

const router = Router();

// Obtener la lista de deseos
router.get('/', protect, getWishlist);

// Agregar un producto a la lista de deseos
router.post('/', protect, addToWishlist);

// Eliminar un producto de la lista de deseos
router.delete('/:productId', protect, removeFromWishlist);

export default router;
