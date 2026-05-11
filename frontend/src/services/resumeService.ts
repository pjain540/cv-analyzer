import apiClient from '../api/apiClient';

export interface Resume {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  linkedInUrl: string;
  gitHubUrl: string;
  portfolioUrl: string;
  education: string;
  aiSummary: string;
  resume: {
    url: string;
    public_id: string;
    hashKey: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ResumeResponse {
  data: Resume[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export const resumeService = {
  getAllResumes: async (page: number = 1, limit: number = 10): Promise<ResumeResponse> => {
    const response = await apiClient.get<any>(`/resumes?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  getResumeById: async (id: string): Promise<Resume> => {
    const response = await apiClient.get<any>(`/resumes/${id}`);
    return response.data.data;
  },

  deleteResume: async (id: string) => {
    const response = await apiClient.delete(`/resumes/delete/${id}`);
    return response.data;
  },

  uploadResumes: async (formData: FormData) => {
    const response = await apiClient.post<any>('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
