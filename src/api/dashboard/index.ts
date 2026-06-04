import axiosClient from "../axiosClient";
import type { ApiResponse, DashboardData, DashboardChartData, ChartQueryParams } from "../../types/dashboard";

export const dashboardApi = {
  getStats(): Promise<ApiResponse<DashboardData>> {
    return axiosClient.get("/dashboard");
  },
  getChart(params: ChartQueryParams): Promise<ApiResponse<DashboardChartData>> {
    return axiosClient.get("/dashboard/v2/chart", { params });
  },
};
