import apiClient from "./api-client";
import { AuthAPI, CreateUserRequestBody, LoginRequestBody, Tokens, User } from "@things-i-like/auth";

const AuthService: AuthAPI = {
  login: async (req: LoginRequestBody): Promise<Tokens> => {
    const response = await apiClient.post("/auth/login", req);
    const tokens: Tokens = response.data;

    localStorage.setItem('tokens', JSON.stringify(tokens));

    return tokens;
  },
  register: function (req: CreateUserRequestBody): Promise<User> {
    return apiClient.post("/auth/register", req);
  }
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('tokens');
};


export default AuthService;