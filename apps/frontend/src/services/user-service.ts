import { User } from "@things-i-like/auth";
import { UserAPI } from "@things-i-like/user";
import { ObjectId } from "bson";
import apiClient from "./api-client";
import authService from "./auth-service";

const userService: UserAPI = {
  getById: async (req: ObjectId) => {
    return (await apiClient.get(`/users/${req}`)).data;
  },
  getAll: async (req: Partial<User>): Promise<User[]> =>{
    return (await apiClient.get("/users", { params: req })).data;
  },
  update: async (req: Omit<User, '_id' | 'email'>) => {
    return (await apiClient.post(`/users/${authService.getUserId()}`, req, {
      headers: { 'Authorization': `Bearer ${authService.getTokens().accessToken}` }
    })).data;
  }
};

export default userService;