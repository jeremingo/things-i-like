import { CommentAPI, Comment } from "@things-i-like/comment";
import apiClient from "./api-client";
import { ObjectId } from "bson";
import authService from "./auth-service";

const CommentService: CommentAPI = {
  async getAll(filter: Partial<Comment>): Promise<Comment[]> {
    return (await apiClient.get('/comments', { params: filter })).data;
  },
  async getById(id: ObjectId): Promise<Comment> {
    return (await apiClient.get(`/comments/${id}`)).data;
  },
  async create(comment: Omit<Comment, 'userId'>): Promise<Comment> {
    return (await apiClient.post('/comments', comment, {
      headers: { 'Authorization': `Bearer ${authService.getTokens().accessToken}` }
    })).data;
  },
  async deleteItem(id: ObjectId): Promise<void> {
    return await apiClient.delete(`/comments/${id}`, {
      headers: { 'Authorization': `Bearer ${authService.getTokens().accessToken}` }
    });
  },
  async update(comment: Omit<Comment, 'userId'>): Promise<Comment> {
    return (await apiClient.post(`/comments/${comment._id}`, comment, {
      headers: { 'Authorization': `Bearer ${authService.getTokens().accessToken}` }
    })).data;
  },
};

export default CommentService;