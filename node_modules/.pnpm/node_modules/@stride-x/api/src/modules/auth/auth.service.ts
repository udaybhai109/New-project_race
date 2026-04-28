import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  login(email: string) {
    return {
      accessToken: `dev-token-for-${email}`,
      refreshToken: `dev-refresh-for-${email}`,
      userId: "user_demo"
    };
  }

  oauth(provider: "google" | "apple", code: string) {
    return {
      provider,
      code,
      accessToken: `oauth-${provider}-token`,
      userId: "user_demo"
    };
  }
}

