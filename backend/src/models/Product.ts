import { Schema, model, Document } from 'mongoose';

export interface IReview {
    user: Schema.Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  reviews: IReview[];
  rating: number;
  numReviews: number;
}

const reviewSchema = new Schema<IReview>(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
    },
    images: {
      type: [String],
      required: [true, 'Al menos una imagen es obligatoria'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
    },
    brand: {
      type: String,
      required: [true, 'La marca es obligatoria'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      default: 0,
    },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default model<IProduct>('Product', productSchema);
