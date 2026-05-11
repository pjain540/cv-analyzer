import apiClient from '../api/apiClient';

export interface JobDescription {
  _id?: string;
  id?: string;
  title: string;
  experience: string;
  skills: string[];
  description: string;
  createdAt?: string;
}

export const jobService = {
  createJobDescription: async (data: JobDescription) => {
    const response = await apiClient.post<any>('/job-descriptions/create', data);
    return response.data.data;
  },

  getAllJobDescriptions: async (page: number = 1, limit: number = 10, pagination: boolean = true) => {
    const response = await apiClient.get<any>(`/job-descriptions?page=${page}&limit=${limit}&pagination=${pagination}`);
    return response.data.data;
  },

  getJobDescriptionById: async (id: string) => {
    const response = await apiClient.get<any>(`/job-descriptions/${id}`);
    return response.data.data;
  },

  deleteJobDescription: async (id: string) => {
    const response = await apiClient.delete(`/job-descriptions/delete/${id}`);
    return response.data;
  },

  updateJobDescription: async (id: string, data: JobDescription) => {
    const response = await apiClient.patch<any>(`/job-descriptions/update/${id}`, data);
    return response.data.data;
  },
};
