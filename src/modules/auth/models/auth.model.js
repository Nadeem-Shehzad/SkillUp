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
      //unique: true,
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
      enum: ['user', 'instructor', 'admin'],
      default: 'user',
   },
   isVerified: {
      type: Boolean,
      default: false,
   },
   avatar: {
      type: String, // URL or filename
      default: '',
   },
   bio: {
      type: String,
      default: '',
   },
}, {
   timestamps: true,
});

userSchema.statics.isEmailTaken = async function ({ email }) {
   if (await this.findOne({ email })) {
      return true;
   }
}

const User = mongoose.model('User', userSchema);
export default User;