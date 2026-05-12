import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { LoginUserService, logoutUserService, registerUserService } from "./user.services.js";
import type { Request, Response } from "express";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await registerUserService(req.body as any);
    return res
        .status(201)
        .json(new ApiResponse(201, null, "User registered successfully"));
})

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await LoginUserService(req.body as any);
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User logged in successfully"));
})

export const logoutUser = asyncHandler(async (req: any, res: Response) => {
    await logoutUserService(req.user?._id);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});