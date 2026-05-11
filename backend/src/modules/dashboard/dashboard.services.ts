import { Resume } from "../uploadResumes/resumes.model.js"
import { JobDescription } from "../jobDescription/jobDescription.model.js"
import { AnalysisResult } from "../analysisResult/result.model.js"

export const getDashboardCountsService = async () => {
    const [totalResumes, totalJobDescriptions, totalResults] = await Promise.all([
        Resume.countDocuments(),
        JobDescription.countDocuments(),
        AnalysisResult.countDocuments()
    ])

    return {
        totalResumes,
        totalJobDescriptions,
        totalResults
    }
}

export const getLatestFiveResultService = async () => {
    const data = await AnalysisResult
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("jobDescription", "title role experience")
        .populate("resumes.resumeId", "name ")

    return { data }

}