import { ObjectId } from "bson";
import apiClient from "./api-client";
import { AuthAPI, CreateUserRequestBody, LoginRequestBody, RefreshTokenBody, Tokens, User } from "@things-i-like/auth";

class AuthService {
  authAPI: AuthAPI = {
    login: async (req: LoginRequestBody): Promise<Tokens> => {
      return (await apiClient.post("/auth/login", req)).data;
    },
    register: async (req: CreateUserRequestBody): Promise<User> => {
      return (await apiClient.post("/auth/register", req)).data;
    },
    logout: async (req: RefreshTokenBody): Promise<void> => {
      return await apiClient.post("/auth/logout", req).then(() => {
      });
    }
  };

  getTokens (): Tokens {
    return JSON.parse(localStorage.getItem('tokens') || '{}') as Tokens;
  }

  async login (req: LoginRequestBody): Promise<void> {
    const tokens: Tokens = await this.authAPI.login(req);

    localStorage.setItem('tokens', JSON.stringify(tokens));
    window.dispatchEvent(new Event('authChange'));
  }

  async register (req: CreateUserRequestBody): Promise<void> {
    await this.authAPI.register(req);
  }

  async logout (): Promise<void> {
    await this.authAPI.logout({ refreshToken: this.getTokens().refreshToken })
    .then(() => {
      localStorage.removeItem('tokens');
      window.dispatchEvent(new Event('authChange'));
    });
  }

  isLoggedIn (): boolean {
    return !!localStorage.getItem('tokens');
  }

  getUserId (): ObjectId | null {
    return this.getTokens()?.userId;
  }
};

export default new AuthService();