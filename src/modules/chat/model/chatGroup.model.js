import mongoose from "mongoose";

const groupChatMessageSchema = new mongoose.Schema(
   {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, },
      courseName: { type: String, required: true },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
      senderName: { type: String, required: true },
      message: { type: String, required: true, trim: true, },
      role: { type: String, required: true },
      readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // for read receipts
      deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   },
   { timestamps: true }
);

export const GroupChatMessage = mongoose.model("GroupChat", groupChatMessageSchema);