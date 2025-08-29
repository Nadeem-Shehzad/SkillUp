import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    discount:{
      type: Number
    },
    currency: {
      type: String,
      enum: ["USD", "PKR", "EUR"],
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled", "refunded"],
      default: "pending",
    },
    paymentProvider: {
      type: String,
      enum: ["stripe", "paypal", "razorpay"],
    },
    transactionId: {
      type: String, // ID returned from payment provider
    },
    metadata: {
      type: Object, // any extra info (coupon applied, discount %, etc.)
    },
  },
  { timestamps: true }
);

// optional: index for faster queries
orderSchema.index({ studentId: 1, courseId: 1 });

export const Order = mongoose.model("Order", orderSchema);