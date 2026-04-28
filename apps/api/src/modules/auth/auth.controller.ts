import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return { data: this.authService.login(body.email) };
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

