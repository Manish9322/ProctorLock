import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true,
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true,
    },
    status: {
        type: String,
        enum: ['Assigned', 'In-Progress', 'Completed', 'Flagged'],
        default: 'Assigned',
    },
    score: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

// Prevent a candidate from being assigned to the same test more than once
assignmentSchema.index({ test: 1, candidate: 1 }, { unique: true });

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

export default Assignment;

    