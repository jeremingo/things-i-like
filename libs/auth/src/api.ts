import { Tokens } from "./tokens";
import { User } from "./user";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface CreateUserRequestBody {
  email: string;
  username: string;
  displayName?: string;
  password: string;
}

export interface AuthAPI {
  register(req: CreateUserRequestBody): Promise<User>;
  login(req: LoginRequestBody): Promise<Tokens>;
}