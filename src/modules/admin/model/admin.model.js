import mongoose from "mongoose";

const PERMISSIONS = [
   "manage_courses",
   "manage_users",
   "manage_enrollments",
   "approve_instructors",
   "payouts",
   "reports"
];

const AdminProfileSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   permissions: [{
      type: String,
      enum: PERMISSIONS
   }],
   roleLevel: {
      type: String,
      enum: ["super-admin", "admin", "moderator"],
      default: "admin"
   },
   isApproved: {
      type: Boolean,
      default: false 
   },
   isBlocked: {
      type: Boolean,
      default: false
   }
}, { timestamps: true });

AdminProfileSchema.pre('save', function (next) {
  if (this.isModified('roleLevel') && this.roleLevel === 'super-admin') {
    throw new Error("Super-admin role cannot be assigned via API");
  }
  next();
});

export const Admin = mongoose.model('admin', AdminProfileSchema);