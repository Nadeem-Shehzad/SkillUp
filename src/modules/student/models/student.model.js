import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;

const studentSchema = new mongoose.Schema({
   user: {
      type: ObjectId,
      ref: 'User',
      required: true
   },
   educationLevel: {
      type: String,
      enum: [
         "High School",
         "Diploma",
         "Bachelor's",
         "Master's",
         "Self-Taught"
      ],
      default: "Bachelor's"
   },
   enrolledCourses: [{
      type: ObjectId,
      ref: 'Course'
   }],
   preferences: {
      language: {
         type: String,
         enum: ['English', 'Urdu'],
         default: 'English'
      },              // preferred learning language
      learningGoal: {
         type: String,
         enum: [
            "Get a Job",
            "Learn a New Skill",
            "Advance My Career",
            "Prepare for Exams",
            "Start a Project"
         ],
         default: "Learn a New Skill"
      }
   },
   bookmarks: [{
      type: ObjectId,
      ref: 'Course'
   }],
   bio: {
      type: String,
      maxlength: 500,
      default: '',
   },
   isblocked: {
      type: Boolean,
      default: false
   }
}, { timestamps: true });

studentSchema.index({ user: 1 }, { unique: 1 });

export const Student = mongoose.model('Student', studentSchema);