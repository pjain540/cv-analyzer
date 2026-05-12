import mongoose, { Schema } from "mongoose";
import type { IAnalysisResult } from "./result.interface.js";

const analysisResultSchema = new Schema<IAnalysisResult>(
    {
        jobDescription: {
            type: Schema.Types.ObjectId,
            ref: "JobDescription"
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        resumes: [
            {
                resumeId: {
                    type: Schema.Types.ObjectId,
                    ref: "Resume"
                },
                score: {
                    type: Number
                },
                aiRemark: {
                    type: String
                },
                matchPercentage: {
                    type: Number
                }
            }
        ]
    },

    {
        timestamps: true
    }
);

export const AnalysisResult = mongoose.model<IAnalysisResult>("AnalysisResult", analysisResultSchema);