import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
      },
      slug: {
         type: String,
         //required: true,
         lowercase: true,
      },
      description: {
         type: String,
         required: true,
      },
      thumbnail: {
         id: {
            type: String,
            default: ''
         },
         url: {
            type: String,
            default: ''
         }
      },
      category: {
         type: String,
         required: true,
         enum: ['programming', 'design', 'marketing', 'business', 'photography', 'others'],
      },
      level: {
         type: String,
         enum: ['beginner', 'intermediate', 'advanced'],
         default: 'beginner',
      },
      price: {
         type: Number,
         required: true,
      },
      discount: {
         type: Number,
         default: 0,
      },
      tags: [String], // e.g. ['JavaScript', 'React']
      language: {
         type: String,
         default: 'English',
      },
      totalLectures: {
         type: Number,
         default: 0,
      },
      content: [
         {
            title: String,
            videoUrl: String,
            duration: String,
            isFree: Boolean, // preview video access
         },
      ],
      instructor: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Instructor',
         required: true,
      },
      ratings: [
         {
            student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
            rating: { type: Number, min: 1, max: 5 },
            review: String,
         },
      ],
      averageRating: {
         type: Number,
         default: 0,
      },
      isPublished: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

courseSchema.index({ slug: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ tags: 1 });

courseSchema.index({ title: 'text' });

export const Course = mongoose.model('Course', courseSchema);