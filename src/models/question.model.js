import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['mcq', 'descriptive'],
        required: [true, 'Question type is required']
    },
    text: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true,
    },
    options: {
        type: [String],
        // Required only if type is 'mcq'
        validate: {
            validator: function(v) {
                return this.type !== 'mcq' || (Array.isArray(v) && v.length > 0);
            },
            message: 'Options are required for Multiple Choice Questions.'
        }
    },
    correctAnswer: {
        type: String,
        // Required only if type is 'mcq'
         validate: {
            validator: function(v) {
                return this.type !== 'mcq' || (typeof v === 'string' && v.length > 0);
            },
            message: 'A correct answer is required for Multiple Choice Questions.'
        }
    },
    marks: {
        type: Number,
        required: [true, 'Marks are required'],
        min: [0, 'Marks cannot be negative']
    },
    negativeMarks: {
        type: Number,
        default: 0,
        min: [0, 'Negative marks cannot be negative']
    }
}, {
    timestamps: true
});

questionSchema.index({ text: 'text' });
questionSchema.index({ type: 1 });

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
