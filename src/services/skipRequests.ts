import api from "./api";
import { SkipRequest, CreateSkipRequestData } from "../types/api";

export const skipRequestService = {
  // Create skip request
  createSkipRequest: async (
    data: CreateSkipRequestData
  ): Promise<SkipRequest> => {
    const response = await api.post("/skip/", data);
    return response.data;
  },

  // Get skip requests
  getSkipRequests: async (
    startDate: string,
    endDate: string
  ): Promise<SkipRequest[]> => {
    const response = await api.get(
      `/skip/list/?start_date=${startDate}&end_date=${endDate}`
    );
    return response.data;
  },

  // Cancel skip request
  cancelSkipRequest: async (skipId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/skip/${skipId}/`);
    return response.data;
  },

  // Get skip request by ID
  getSkipRequest: async (skipId: string): Promise<SkipRequest> => {
    const response = await api.get(`/skip/${skipId}/`);
    return response.data;
  },

  // Update skip request
  updateSkipRequest: async (
    skipId: string,
    data: Partial<CreateSkipRequestData>
  ): Promise<SkipRequest> => {
    const response = await api.put(`/skip/${skipId}/`, data);
    return response.data;
  },
};
