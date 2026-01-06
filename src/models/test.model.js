import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Test title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    candidates: {
      type: Number,
      default: 0,
    },
    marks: {
      type: Number,
      required: [true, "Total marks are required"],
    },
    status: {
      type: String,
      enum: ["Active", "Finished", "Draft"],
      default: "Draft",
    },
    approval: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Pending",
    },
    createdBy: {
      type: String, // In a real app, this would be mongoose.Schema.Types.ObjectId ref: "User"
      required: [true, "Creator email is required"],
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    scheduling: {
      date: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      duration: { type: Number, required: true },
    },
    questions: {
      mcqCount: { type: Number, default: 0 },
      descriptiveCount: { type: Number, default: 0 },
    },
    rules: {
      fullscreen: { type: Boolean, default: true },
      focusHandling: { type: String, default: "terminate" },
      requireWebcam: { type: Boolean, default: true },
      snapshotInterval: { type: String, default: "30s" },
      requireMic: { type: Boolean, default: true },
      disableCopyPaste: { type: Boolean, default: true },
      disableRightClick: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Add a unique compound index for title and createdBy to prevent duplicate tests by the same user
testSchema.index({ title: 1, createdBy: 1 }, { unique: true });

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

export default Test;
