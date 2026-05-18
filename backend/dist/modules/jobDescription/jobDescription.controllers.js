import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as jobDescriptionService from "./jobDescription.services.js";
export const createJobDescription = asyncHandler(async (req, res) => {
    const { title, experience, skills, description } = req.body;
    const userId = req.user._id;
    if (!title || !experience || !skills || !description) {
        throw new ApiError(400, "All fields are required");
    }
    const jobDescription = await jobDescriptionService.createJobDescription({
        title,
        experience,
        skills,
        description,
        user: userId,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, jobDescription, "Job Description created successfully"));
});
export const getAllJobDescriptions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const pagination = req.query.pagination !== "false";
    const userId = req.user._id;
    const result = await jobDescriptionService.getAllJobDescriptions(page, limit, pagination, userId);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Job Descriptions fetched successfully"));
});
export const getJobDescriptionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const jobDescription = await jobDescriptionService.getJobDescriptionById(id);
    if (!jobDescription) {
        throw new ApiError(404, "Job Description not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, jobDescription, "Job Description fetched successfully"));
});
export const updateJobDescription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const jobDescription = await jobDescriptionService.updateJobDescription(id, req.body);
    if (!jobDescription) {
        throw new ApiError(404, "Job Description not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, jobDescription, "Job Description updated successfully"));
});
export const deleteJobDescription = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const jobDescription = await jobDescriptionService.deleteJobDescription(id);
    if (!jobDescription) {
        throw new ApiError(404, "Job Description not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Job Description deleted successfully"));
});
//# sourceMappingURL=jobDescription.controllers.js.map