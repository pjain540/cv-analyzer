import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../modules/user/user.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1. Get token from header
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        // 2. Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // 3. Find user in database (excluding password)
        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        // 4. Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
//# sourceMappingURL=auth.middleware.js.map