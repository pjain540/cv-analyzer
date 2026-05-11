import { asyncHandler } from "../../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { getDashboardCountsService, getLatestFiveResultService } from "./dashboard.services.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const getDashboardCounts = asyncHandler(async (req: Request, res: Response) => {
    const counts = await getDashboardCountsService();

    return res
        .status(200)
        .json(new ApiResponse(200, counts, "Dashboard counts fetched successfully"))
})

export const getLatestFiveResult = asyncHandler(async (req: Request, res: Response) => {
    const results = await getLatestFiveResultService();

    return res
        .status(200)
        .json(new ApiResponse(200, results, "Latest five results fetched successfully"))
})