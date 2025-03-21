import { ObjectId } from "bson";
import apiClient from "./api-client";
import { AuthAPI, CreateUserRequestBody, LoginRequestBody, RefreshTokenBody, Tokens, User } from "@things-i-like/auth";

const AuthService: AuthAPI = {
  login: async (req: LoginRequestBody): Promise<Tokens> => {
    const response = await apiClient.post("/auth/login", req);
    const tokens: Tokens = response.data;

    localStorage.setItem('tokens', JSON.stringify(tokens));
    window.dispatchEvent(new Event('authChange'));

    return tokens;
  },
  register: function (req: CreateUserRequestBody): Promise<User> {
    return apiClient.post("/auth/register", req);
  },
  logout: async (req: RefreshTokenBody): Promise<void> => {
    return await apiClient.post("/auth/logout", req).then(() => {
      localStorage.removeItem('tokens');
      window.dispatchEvent(new Event('authChange'));
    });
  }
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('tokens');
};

export const getUserId = (): ObjectId | null => {
  return (JSON.parse(localStorage.getItem('tokens') || '{}') as Tokens)?.userId;
};


export default AuthService;