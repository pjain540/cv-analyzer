import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as resumeService from "./resumes.services.js";
import type { Request, Response } from "express";

export const uploadResumes = asyncHandler(async (req: any, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        const userId = req.user._id
        if (!files || files.length === 0) {
            throw new ApiError(400, "No resumes uploaded");
        }

        // Process all resumes in parallel with error handling for each
        const results = await Promise.allSettled(
            files.map(file => resumeService.processResume(file, userId))
        );

        const processedResults = results.map((res, index) => ({
            fileName: files[index]?.originalname || "",
            result: res.status === 'fulfilled' ? res.value : { status: "error", error: res.reason.message }
        }));

        return res.status(200).json(
            new ApiResponse(200, processedResults, "Bulk processing complete")
        );
    } catch (error: any) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

export const getAllResumes = asyncHandler(async (req: any, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const pagination = req.query.pagination !== "false";
    const userId = req.user._id

    const resumes = await resumeService.getAllResumes(page, limit, pagination, userId);

    return res.status(200).json(
        new ApiResponse(200, resumes, "Resumes fetched successfully")
    );
});

export const getResumeById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const resume = await resumeService.getResumeById(id);

    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    return res.status(200).json(
        new ApiResponse(200, resume, "Resume fetched successfully")
    );
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const resume = await resumeService.deleteResume(id);

    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Resume deleted successfully")
    );
});
