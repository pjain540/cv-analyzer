import mongoose, { Schema } from "mongoose";
const jobDescriptionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    experience: {
        type: String,
        required: [true, "Experience is required"],
    },
    skills: {
        type: [String],
        required: [true, "Skills are required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: true,
});
export const JobDescription = mongoose.model("JobDescription", jobDescriptionSchema);
//# sourceMappingURL=jobDescription.model.js.map