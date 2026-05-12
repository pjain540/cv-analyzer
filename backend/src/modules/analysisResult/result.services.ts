import { Resume } from "../uploadResumes/resumes.model.js";
import { JobDescription } from "../jobDescription/jobDescription.model.js";
import { AnalysisResult } from "./result.model.js";
import { analyzeResume } from "../../services/llm.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { Types } from "mongoose";
import { getPaginatedData } from "../../utils/pagination.js";

export const performAnalysis = async (resumeIds: Types.ObjectId[], jobDescriptionId: Types.ObjectId, userId: Types.ObjectId) => {
    const jd = await JobDescription.findById(jobDescriptionId);
    if (!jd) throw new ApiError(404, "Job Description not found");

    const resumes = await Resume.find({ _id: { $in: resumeIds }, user: userId });
    if (resumes.length === 0) throw new ApiError(404, "No resumes found");

    const jdText = `Title: ${jd.title}, Experience: ${jd.experience}, Skills: ${jd.skills.join(", ")}, Description: ${jd.description}`;

    // Process all resumes and call LLM for each
    const analysisResults = await Promise.all(
        resumes.map(async (resume) => {
            const resumeText = `Role: ${resume.role}, Experience: ${resume.experience}, Skills: ${resume.skills.join(", ")}, Summary: ${resume.aiSummary}`;

            const analysis = await analyzeResume(resumeText, jdText);

            return {
                resumeId: resume._id,
                score: analysis.score,
                matchPercentage: analysis.matchPercentage,
                aiRemark: analysis.aiRemark
            };
        })
    );

    const result = await AnalysisResult.create({
        jobDescription: jobDescriptionId,
        resumes: analysisResults,
        user: userId
    });

    console.log("🎉 Analysis complete and saved successfully!");
    return result;
}

export const getAnalysisById = async (id: string) => {
    const analysis = await AnalysisResult.findById(id)
        .populate("jobDescription", "title experience description")
        .populate("resumes.resumeId", "name role experience");

    if (!analysis) throw new ApiError(404, "Analysis not found");
    return analysis;
}

export const deleteAnalysisById = async (id: string) => {
    const result = await AnalysisResult.findByIdAndDelete(id);
    if (!result) throw new ApiError(404, "Analysis not found");
    return result;
}

export const getAllAnalysis = async (page: number, limit: number, pagination: boolean = true, userId: Types.ObjectId) => {
    const results = await getPaginatedData(
        AnalysisResult,
        { user: userId },
        page,
        limit,
        { createdAt: -1 },
        pagination,
        "jobDescription"
    );
    return results;
}
