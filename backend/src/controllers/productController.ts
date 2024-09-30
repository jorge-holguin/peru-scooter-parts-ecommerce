import { Request, Response } from 'express';
import Product from '../models/Product';

interface AuthRequest extends Request {
    user?: any;
  }

export const createProductReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Ya has reseñado este producto' });
      }

      const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
        createdAt: new Date(),
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Reseña agregada' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error al agregar reseña', error: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
      const pageSize = 10; // Tamaño de página para la paginación
      const page = Number(req.query.pageNumber) || 1;
  
      const keyword = req.query.keyword
        ? {
            // Búsqueda por nombre o descripción
            $or: [
              {
                name: {
                  $regex: req.query.keyword,
                  $options: 'i',
                },
              },
              {
                description: {
                  $regex: req.query.keyword,
                  $options: 'i',
                },
              },
            ],
          }
        : {};
  
      // Filtrado por categoría
      const category = req.query.category
        ? {
            category: req.query.category,
          }
        : {};
  
      // Filtrado por marca
      const brand = req.query.brand
        ? {
            brand: req.query.brand,
          }
        : {};
  
      // Filtrado por rango de precio
      let price = {};
      if (req.query.minPrice || req.query.maxPrice) {
        price = {
          price: {
            $gte: Number(req.query.minPrice) || 0,
            $lte: Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER,
          },
        };
      }
  
      // Combinar los filtros
      const filter = { ...keyword, ...category, ...brand, ...price };
  
      const count = await Product.countDocuments(filter);
  
      const products = await Product.find(filter)
        .limit(pageSize)
        .skip(pageSize * (page - 1));
  
      res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
  };

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, images, category, brand, stock } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      images,
      category,
      brand,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};


export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
      const productId = req.params.id;
  
      const {
        name,
        description,
        price,
        images,
        category,
        brand,
        stock,
      } = req.body;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.images = images || product.images;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.stock = stock !== undefined ? stock : product.stock;
  
      const updatedProduct = await product.save();
  
      res.status(200).json({
        message: 'Producto actualizado exitosamente',
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error al actualizar el producto',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
      const productId = req.params.id;
  
      const product = await Product.findByIdAndDelete(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({
        message: 'Error al eliminar el producto',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };
  
// Implementa las funciones para actualizar y eliminar productos
