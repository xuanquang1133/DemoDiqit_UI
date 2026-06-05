import axiosClient from "../axiosClient";
import type { ApiResponse } from "../../types/common";

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
  return axiosClient.put<any, ApiResponse<null>>("/auth/change-password", data);
};
