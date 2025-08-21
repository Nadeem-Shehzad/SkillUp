import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   studentName: String,
   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
   courseName: String,
   instructorName: String,
   rating: { type: Number, min: 1, max: 5, required: true },
   comment: String,
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);