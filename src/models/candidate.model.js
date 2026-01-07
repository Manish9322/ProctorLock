import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Candidate name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        required: true,
    },
    college: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    timezone: {
        type: String,
    },
    govIdType: {
        type: String,
    },
    govIdNumber: {
        type: String,
    },
    approvalStatus: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected'],
        default: 'Approved',
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    examId: String, // Keep these for mock data consistency for now
    status: String,
    score: Number,
}, {
    timestamps: true
});

// Pre-save hook to set approval status based on role
candidateSchema.pre('save', function(next) {
    if (this.role === 'examiner' && this.isNew) {
        this.approvalStatus = 'Pending';
    }
    next();
});

candidateSchema.index({ email: 1 });

const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);

export default Candidate;

    