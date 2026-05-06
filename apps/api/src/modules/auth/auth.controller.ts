import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return { data: this.authService.login(body.email) };
  }

  @Post("signup")
  signup(@Body() body: { email: string; displayName: string; countryCode?: string }) {
    return { data: this.authService.signup(body) };
  }

  @Post("otp/send")
  sendOtp(@Body() body: { email: string }) {
    return { data: this.authService.sendOtp(body.email) };
  }

  @Post("otp/verify")
  verifyOtp(@Body() body: { email: string; code: string }) {
    return { data: this.authService.verifyOtp(body.email, body.code) };
  }

  @Post("oauth")
  oauth(@Body() body: { provider: "google" | "apple"; code: string }) {
    return { data: this.authService.oauth(body.provider, body.code) };
  }

  @Post("refresh")
  refresh(@Body() body: { refreshToken: string }) {
    return {
      data: {
        accessToken: `refreshed-${body.refreshToken}`,
        expiresInSeconds: 3600
      }
    };
  }
}
