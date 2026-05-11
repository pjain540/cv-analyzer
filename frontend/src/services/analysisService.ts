import apiClient from '../api/apiClient';

export interface AnalysisRequest {
    resume: string[]; // Array of resume IDs
    jobDescription: string; // Job Description ID
}

const analysisService = {
    createAnalysis: async (data: AnalysisRequest) => {
        const response = await apiClient.post<any>('/analyze/create', data);
        return response.data.data;
    },
    getAnalysisById: async (id: string) => {
        const response = await apiClient.get<any>(`/analyze/${id}`);
        return response.data.data;
    },
    getAllAnalysis: async (page: number = 1, limit: number = 10) => {
        const response = await apiClient.get<any>(`/analyze?page=${page}&limit=${limit}`);
        return response.data.data;
    },
    deleteAnalysis: async (id: string) => {
        const response = await apiClient.delete<any>(`/analyze/${id}`);
        return response.data;
    },
};

export default analysisService;
