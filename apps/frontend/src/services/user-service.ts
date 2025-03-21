import { User } from "@things-i-like/auth";
import { UserAPI } from "@things-i-like/user";
import { ObjectId } from "bson";
import apiClient from "./api-client";

const userService: UserAPI = {
  getById: async (req: ObjectId) => {
    return (await apiClient.get(`/users/${req}`)).data;
  },
  getAll: async (req: Partial<User>): Promise<User[]> =>{
    return (await apiClient.get("/users", { params: req })).data;
  }
};

export default userService;