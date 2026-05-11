import mongoose, { Schema } from "mongoose";
import type { IJobDescription } from "./jobDescription.interface.js";

const jobDescriptionSchema = new Schema<IJobDescription>(
    {
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
    },
    {
        timestamps: true,
    }
);

export const JobDescription = mongoose.model<IJobDescription>("JobDescription", jobDescriptionSchema);
