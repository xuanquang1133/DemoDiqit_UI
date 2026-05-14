import axiosClient from "../axiosClient";
import type { LoginRequest, LoginResponse } from "../../types/login";

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return axiosClient.post<any, LoginResponse>("/auth/login", credentials);
};
