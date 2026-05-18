import axiosClient from "../axiosClient";
import type { User } from "../../types/auth";
import type { MeResponse } from "../../types/login";

export const getMe = async (): Promise<User> => {
  const response = await axiosClient.get<any, MeResponse>("/user-info-by-token");
  const data = response.data;
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    full_name: data.full_name,
    roles: data.roles,
  };
};
