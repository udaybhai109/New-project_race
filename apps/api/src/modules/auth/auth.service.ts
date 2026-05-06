import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  private readonly otpChallenges = new Map<string, { code: string; expiresAt: number }>();

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

  signup(input: { email: string; displayName: string; countryCode?: string }) {
    return {
      userId: "user_demo",
      email: input.email,
      displayName: input.displayName,
      countryCode: input.countryCode ?? "IN",
      nextStep: "verify_email_otp"
    };
  }

  sendOtp(email: string) {
    const code = "246810";
    this.otpChallenges.set(email, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    return {
      email,
      delivery: "email",
      expiresInSeconds: 300,
      demoCode: code
    };
  }

  verifyOtp(email: string, code: string) {
    const challenge = this.otpChallenges.get(email);
    const verified = Boolean(challenge && challenge.code === code && challenge.expiresAt > Date.now());

    if (verified) {
      this.otpChallenges.delete(email);
    }

    return {
      verified,
      accessToken: verified ? `verified-dev-token-for-${email}` : null,
      userId: verified ? "user_demo" : null
    };
  }
}
