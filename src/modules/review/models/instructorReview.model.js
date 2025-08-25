import mongoose from "mongoose";

const instructorReviewSchema = new mongoose.Schema({
   instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true
   },
   studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
   },
   rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
   },
   comment: {
      type: String,
      trim: true
   }
}, { timestamps: true });

export const InstructorReview = mongoose.model('InstructorReview', instructorReviewSchema);