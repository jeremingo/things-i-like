import { Post, PostAPI } from "@things-i-like/post";
import { ObjectId } from "bson";
import apiClient from "./api-client";
import authService from "./auth-service";

const PostService: PostAPI = {
  getById: async (req: ObjectId) => {
    return (await apiClient.get(`/posts/${req}`)).data;
  },
  getAll: async (req: Partial<Post>): Promise<Post[]> => {
    return (await apiClient.get("/posts", { params: req })).data;
  },
  create: async (req: Omit<Post, 'userId'>) => {
    return (await apiClient.post("/posts", req, {
      headers: { 'Authorization': `Bearer ${authService.getTokens().accessToken}` }
    })).data;
  },
  deleteItem: async (req: ObjectId) => {
    await apiClient.delete(`/posts/${req}`, {
      headers: { 'Authorization': `Bearer ${authService.getTokens().accessToken}` }
    });
  }
};

export default PostService;