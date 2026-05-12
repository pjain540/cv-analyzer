import apiClient from "../api/apiClient";

export interface User {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export const userService = {
    registerUser: async (user: User) => {
        const response = await apiClient.post<any>('/user/register', user);
        return response.data;
    },
    loginUser: async (user: User) => {
        const response = await apiClient.post<any>('/user/login', user);
        return response.data;
    },
    logoutUser: async () => {
        const response = await apiClient.post<any>('/user/logout');
        return response.data;
    }
}