import type { Types } from "mongoose";

export interface IAnalysisResult {
    jobDescription: Types.ObjectId;
    resumes: {
        resumeId: Types.ObjectId;
        score: number;
        aiRemark: string;
        matchPercentage: number;
    }[];
}