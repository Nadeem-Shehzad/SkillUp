import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      bio: {
         type: String,
         trim: true,
      },
      expertise: {
         type: [String] // e.g., ['JavaScript', 'Data Science']
      },
      qualifications: {
         type: [String],
      },
      socialLinks: {
         website: String,
         linkedin: String,
         twitter: String,
         github: String,
      },
      totalCourses: {
         type: Number,
         default: 0,
      },
      totalStudents: {
         type: Number,
         default: 0,
      },
      averageRating: {
         type: Number,
         default: 0,
      },
      totalReviews: {
         type: Number,
         default: 0
      },
      status: {
         type: String,
         enum: ['pending', 'approved', 'rejected'],
         default: 'pending',
      },
   },
   {
      timestamps: true,
   }
);


instructorSchema.index({ user: 1 });
instructorSchema.index({ expertise: 1 });
instructorSchema.index({ qualifications: 1 });
instructorSchema.index({ averageRating: 1 });

instructorSchema.index({ averageRating: -1 }, { totalStudents: -1 });

export const Instructor = mongoose.model('Instructor', instructorSchema);