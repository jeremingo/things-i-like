import { Tokens } from "./tokens";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface AuthAPI {
  login(req: LoginRequestBody): Promise<Tokens>;
}