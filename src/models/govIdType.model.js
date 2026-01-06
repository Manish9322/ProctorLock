import mongoose from "mongoose";

const govIdTypeSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    value: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
});

const GovIdType = mongoose.models.GovIdType || mongoose.model("GovIdType", govIdTypeSchema);

export default GovIdType;
