import apiClient from "./api-client";
import { AuthAPI, CreateUserRequestBody, LoginRequestBody, Tokens, User } from "@things-i-like/auth";

const AuthService: AuthAPI = {
  login: async (req: LoginRequestBody): Promise<{ tokens: Tokens, user: User }> => {
    const response: { tokens: Tokens, user: User } = (await apiClient.post("/auth/login", req)).data;

    localStorage.setItem('tokens', JSON.stringify(response.tokens));
    localStorage.setItem('user', JSON.stringify(response.user));

    return response;
  },
  register: function (req: CreateUserRequestBody): Promise<User> {
    return apiClient.post("/auth/register", req);
  }
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('tokens');
};


export default AuthService;