// backend/src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string; // Cambiado para ser opcional
  avatar?: string;
  googleId?: string;
  githubId?: string;
  role: 'cliente' | 'administrador';
  comparePassword: (password: string) => Promise<boolean>;
  cart: {
    product: Schema.Types.ObjectId;
    quantity: number;
  }[];
  wishlist: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, // Cambiado para que no sea obligatorio
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    avatar: { type: String },
    googleId: { type: String },
    githubId: { type: String },
    role: {
      type: String,
      enum: ['cliente', 'administrador'],
      default: 'cliente', // Por defecto, se establece como cliente
    },
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    wishlist: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next(); // Si no hay contraseña, saltar el proceso

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false; // Si no hay contraseña, no se puede comparar
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>('User', userSchema);
