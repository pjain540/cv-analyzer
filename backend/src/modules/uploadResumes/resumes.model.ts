import mongoose, { Schema } from "mongoose";
import type { IResume } from "./resumes.interface.js";

const resumeSchema = new Schema<IResume>(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        experience: {
            type: String,
            required: true,
            trim: true,
        },
        resume: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
            hashKey: {
                type: String,
            },
        },
        linkedInUrl: {
            type: String,
            trim: true,
        },
        gitHubUrl: {
            type: String,
            trim: true,
        },
        portfolioUrl: {
            type: String,
            trim: true,
        },
        education: {
            type: String,
            trim: true,
        },
        aiSummary: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

export const Resume = mongoose.model<IResume>("Resume", resumeSchema);