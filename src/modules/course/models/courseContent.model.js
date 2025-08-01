import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
   {
      courseId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Course',
         required: true,
      },
      title: { type: String, required: true },
      video: {
         id: { type: String, default: '' },
         url: { type: String, default: '' },
      },
      duration: { type: String },
      isFree: { type: Boolean, default: false },
      order: { type: Number, default: 0 }, 
   },
   { timestamps: true }
);

contentSchema.index({ courseId: 1 });
export const CourseContent = mongoose.model('CourseContent', contentSchema);