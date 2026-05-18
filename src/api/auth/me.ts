import axiosClient from "../axiosClient";
import type { User } from "../../types/auth";
import type { UserInfoByTokenResponse } from "../../types/login";

/**
 * Fetch authenticated user information using JWT token from Authorization header
 */
export const getUserInfoByToken = async (): Promise<User> => {
  const response = await axiosClient.get<any, UserInfoByTokenResponse>("/user-info-by-token");
  return {
    id: response.data.id,
    username: response.data.username,
    email: response.data.email,
    full_name: response.data.full_name,
    roles: response.data.roles,
  };
};
