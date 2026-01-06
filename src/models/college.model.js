import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['University', 'Organization', 'Institute'],
        required: true,
    },
    registrations: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true,
        trim: true
    }
});

collegeSchema.index({ name: 1 });

const College = mongoose.models.College || mongoose.model("College", collegeSchema);

export default College;
