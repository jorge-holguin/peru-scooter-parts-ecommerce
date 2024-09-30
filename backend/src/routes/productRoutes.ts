import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';
const router = Router();

// Obtener todos los productos con búsqueda y filtrado
router.get('/', getProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Crear un nuevo producto (solo administradores)
router.post('/', protect, admin, createProduct);

// Actualizar un producto (solo administradores)
router.put('/:id', protect, admin, updateProduct);

// Eliminar un producto (solo administradores)
router.delete('/:id', protect, admin, deleteProduct);

// Agregar una reseña a un producto
router.post('/:id/reviews', protect, createProductReview);

export default router;
