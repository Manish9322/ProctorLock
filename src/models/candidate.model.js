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
    // This could link to tests they are assigned to, etc.
    // For now, we keep it simple.
}, {
    timestamps: true
});

candidateSchema.index({ email: 1 });

const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);

export default Candidate;

    