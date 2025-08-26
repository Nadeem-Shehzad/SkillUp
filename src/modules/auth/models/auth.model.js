import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
   },
   email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
   },
   password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
   },
   role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
   },
   isVerified: { 
      type: Boolean,
      default: false,
   },
   image: {
      id: {
         type: String,
         default: ''
      },
      url: {
         type: String,
         default: ''
      }
   }
}, {
   timestamps: true,
});

userSchema.statics.isEmailTaken = async function ({ email }) {
   return !!(await this.findOne({ email }));
};

// apply indexing
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ role: 1 });
// userSchema.index({ email: 1 }, { isVerified: 1 });

const User = mongoose.model('User', userSchema);
export default User;