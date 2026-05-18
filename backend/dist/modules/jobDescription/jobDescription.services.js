import { JobDescription } from "./jobDescription.model.js";
import { getPaginatedData } from "../../utils/pagination.js";
export const createJobDescription = async (data) => {
    const jobDescription = await JobDescription.create(data);
    return jobDescription;
};
export const getAllJobDescriptions = async (page, limit, pagination = true, userId) => {
    return await getPaginatedData(JobDescription, { user: userId }, page, limit);
};
export const getJobDescriptionById = async (id) => {
    return await JobDescription.findById(id);
};
export const updateJobDescription = async (id, data) => {
    return await JobDescription.findByIdAndUpdate(id, data, { new: true });
};
export const deleteJobDescription = async (id) => {
    return await JobDescription.findByIdAndDelete(id);
};
//# sourceMappingURL=jobDescription.services.js.map