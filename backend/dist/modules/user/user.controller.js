import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { LoginUserService, logoutUserService, registerUserService } from "./user.services.js";
export const registerUser = asyncHandler(async (req, res) => {
    const user = await registerUserService(req.body);
    return res
        .status(201)
        .json(new ApiResponse(201, null, "User registered successfully"));
});
export const loginUser = asyncHandler(async (req, res) => {
    const user = await LoginUserService(req.body);
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User logged in successfully"));
});
export const logoutUser = asyncHandler(async (req, res) => {
    await logoutUserService(req.user?._id);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});
//# sourceMappingURL=user.controller.js.map