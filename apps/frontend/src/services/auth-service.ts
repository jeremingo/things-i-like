import apiClient from "./api-client";
import { AuthAPI, LoginRequestBody, Tokens } from "@things-i-like/auth";

const AuthService: AuthAPI = {
  login: async (req: LoginRequestBody): Promise<Tokens> => {
    return apiClient.post("/auth/login", req);
  }
};

export default AuthService;