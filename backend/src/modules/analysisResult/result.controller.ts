import * as resultService from "./result.services.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import type { Request, Response } from "express";

export const createAnalysis = asyncHandler(async (req: any, res: Response) => {
    const { resume, jobDescription } = req.body;
    const userId = req.user._id
    const analysisResult = await resultService.performAnalysis(resume, jobDescription, userId);

    return res.status(201).json(
        new ApiResponse(201, analysisResult, "Analysis performed successfully")
    );
});

export const getAnalysis = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const analysis = await resultService.getAnalysisById(id);

    return res.status(200).json(
        new ApiResponse(200, analysis, "Analysis fetched successfully")
    );
});

export const deleteAnalysis = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await resultService.deleteAnalysisById(id);

    return res.status(200).json(
        new ApiResponse(200, null, "Analysis deleted successfully")
    );
});

export const getAllAnalysis = asyncHandler(async (req: any, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const pagination = req.query.pagination !== "false";
    const userId = req.user._id
    const results = await resultService.getAllAnalysis(page, limit, pagination, userId);

    return res.status(200).json(
        new ApiResponse(200, results, "All analysis fetched successfully")
    );
});
