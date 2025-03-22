export default class Config {
  static DATABASE_URL: string;
  static PORT: string;
  static JWT_SECRET: string;
  static TOKEN_EXPIRES: string;
  static REFRESH_TOKEN_EXPIRES: string;
  static DOMAIN_BASE: string;

  static load(): void {
    this.DATABASE_URL = this.getEnvironmentVariable('DATABASE_URL');
    this.PORT = this.getEnvironmentVariable('PORT');
    this.JWT_SECRET = this.getEnvironmentVariable('JWT_SECRET');
    this.TOKEN_EXPIRES = this.getEnvironmentVariable('TOKEN_EXPIRES');
    this.REFRESH_TOKEN_EXPIRES = this.getEnvironmentVariable('REFRESH_TOKEN_EXPIRES');
    this.DOMAIN_BASE = this.getEnvironmentVariable('DOMAIN_BASE');
  }
  
  private static getEnvironmentVariable(key: string): string {
    const value = process.env[key];
    
    if (!value) {
      throw new Error(`Environment variable ${key} is not set.`);
    }

    return value;
  }
}