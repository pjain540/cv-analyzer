import { asyncHandler } from "../../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { getDashboardCountsService, getLatestFiveResultService } from "./dashboard.services.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const getDashboardCounts = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?._id;
    const counts = await getDashboardCountsService(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, counts, "Dashboard counts fetched successfully"))
})

export const getLatestFiveResult = asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?._id;
    const results = await getLatestFiveResultService(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, results, "Latest five results fetched successfully"))
})