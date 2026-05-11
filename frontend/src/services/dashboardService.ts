import apiClient from "../api/apiClient";

const dashboardService = {
    getDashboardCounts: async () => {
        const response = await apiClient.get<any>(`/dashboard/counts`)
        return response.data
    },

    getLatestFiveAnalysis: async () => {
        const response = await apiClient.get<any>(`/dashboard/latest-results`)
        return response.data.data
    }
}

export default dashboardService;
