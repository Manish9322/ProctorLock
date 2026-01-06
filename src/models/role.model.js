import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
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

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;
