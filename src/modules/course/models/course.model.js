import mongoose from 'mongoose';
import slugify from 'slugify';

const thumbnailSchema = {
   id: {
      type: String,
      default: ''
   },
   url: {
      type: String,
      default: ''
   }
}

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
      thumbnail: thumbnailSchema,
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
      instructor: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Instructor',
         required: true,
      },
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
      isPublished: {
         type: Boolean,
         default: false,
      },
      blockedByAdmin: {
         type: Boolean,
         default: false
      },
      blockReason: {
         type: String
      }
   },
   { timestamps: true }
);

courseSchema.pre('save', function (next) {
   if (this.isModified('title')) {
      this.slug = slugify(this.title, { lower: true, strict: true });
   }

   next();
});

courseSchema.index({ slug: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ tags: 1 });

courseSchema.index({ title: 'text' });

export const Course = mongoose.model('Course', courseSchema);