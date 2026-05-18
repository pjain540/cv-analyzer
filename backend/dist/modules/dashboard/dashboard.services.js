import { Resume } from "../uploadResumes/resumes.model.js";
import { JobDescription } from "../jobDescription/jobDescription.model.js";
import { AnalysisResult } from "../analysisResult/result.model.js";
export const getDashboardCountsService = async (userId) => {
    const [totalResumes, totalJobDescriptions, totalResults] = await Promise.all([
        Resume.countDocuments({ user: userId }),
        JobDescription.countDocuments({ user: userId }),
        AnalysisResult.countDocuments({ user: userId })
    ]);
    return {
        totalResumes,
        totalJobDescriptions,
        totalResults
    };
};
export const getLatestFiveResultService = async (userId) => {
    const data = await AnalysisResult
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("jobDescription", "title role experience")
        .populate("resumes.resumeId", "name ");
    return { data };
};
//# sourceMappingURL=dashboard.services.js.map