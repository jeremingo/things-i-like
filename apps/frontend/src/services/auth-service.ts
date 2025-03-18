import apiClient from "./api-client";
import { AuthAPI, CreateUserRequestBody, LoginRequestBody, Tokens, User } from "@things-i-like/auth";

const AuthService: AuthAPI = {
  login: async (req: LoginRequestBody): Promise<Tokens> => {
    return apiClient.post("/auth/login", req);
  },
  register: function (req: CreateUserRequestBody): Promise<User> {
    return apiClient.post("/auth/register", req);
  }
};

export default AuthService;