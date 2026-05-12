import axiosClient from '../api/axiosClient';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    // Return the response data from the axios instance
    return await axiosClient.post('/auth/login', credentials);
  },
  
  // Future methods like register, logout, etc. can be added here
};
