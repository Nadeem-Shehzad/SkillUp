import mongoose from 'mongoose';
const { Schema } = mongoose;

const enrollmentSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  certificateId: { type: String },
  paymentId: { type: String },
  lastAccessed: { type: Date }
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;