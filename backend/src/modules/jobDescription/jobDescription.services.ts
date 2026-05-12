import { JobDescription } from "./jobDescription.model.js";
import type { IJobDescription } from "./jobDescription.interface.js";
import { getPaginatedData } from "../../utils/pagination.js";
import type { Types } from "mongoose";

export const createJobDescription = async (data: IJobDescription) => {
    const jobDescription = await JobDescription.create(data);
    return jobDescription;
};

export const getAllJobDescriptions = async (page: number, limit: number, pagination: boolean = true, userId: Types.ObjectId) => {
    return await getPaginatedData(JobDescription, { user: userId }, page, limit);
};

export const getJobDescriptionById = async (id: string) => {
    return await JobDescription.findById(id);
};

export const updateJobDescription = async (id: string, data: Partial<IJobDescription>) => {
    return await JobDescription.findByIdAndUpdate(id, data, { new: true });
};

export const deleteJobDescription = async (id: string) => {
    return await JobDescription.findByIdAndDelete(id);
};
