import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'developer', 'qa', 'viewer'],
      default: 'developer',
    },
    phone: String,
    location: String,
    bio: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    twoFactorSecret: String,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
   },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving - Mongoose 8 syntax
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return; // Just return, no next() needed
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Throw error instead of passing to next()
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const User = mongoose.model('User', userSchema);

export default User;