import { User } from "@things-i-like/auth";
import { UserAPI } from "@things-i-like/user";
import { ObjectId } from "bson";
import apiClient from "./api-client";
import authService from "./auth-service";
import { uploadPhoto } from "./file-service";

class UserService {
  userAPI: UserAPI = {
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

  async getById (req: ObjectId): Promise<User> {
    return this.userAPI.getById(req);
  }

  async getAll (req: Partial<User>): Promise<User[]> {
    return this.userAPI.getAll(req);
  }

  async update (req: Omit<User, '_id' | 'email'>, photo: File | undefined): Promise<User> {
    const url = photo ? await uploadPhoto(photo) : undefined;

    req.photo = url;

    return await this.userAPI.update(req);
  }
}

export default new UserService();