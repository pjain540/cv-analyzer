import type { IUser } from "./user.interface.js";
import { User } from "./user.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const registerUserService = async (userData: IUser) => {
    const exististingUser = await User.findOne({ email: userData.email })
    if (exististingUser) {
        throw new ApiError(400, "User already exists");
    }
    const user = await User.create(userData)
    return user;
}

export const LoginUserService = async (userData: IUser) => {
    const user = await User.findOne({ email: userData.email })
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    //check password
    const isPasswordValid = await (user as any).isPasswordCorrect(userData.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }
    const accessToken = await (user as any).generateAccessToken();

    return { user, accessToken }

}

export const logoutUserService = async (userId: string) => {
    return { success: true };
}