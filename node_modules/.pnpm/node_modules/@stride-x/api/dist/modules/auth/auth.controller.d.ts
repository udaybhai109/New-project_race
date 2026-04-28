import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): {
        data: {
            accessToken: string;
            refreshToken: string;
            userId: string;
        };
    };
    oauth(body: {
        provider: "google" | "apple";
        code: string;
    }): {
        data: {
            provider: "google" | "apple";
            code: string;
            accessToken: string;
            userId: string;
        };
    };
    refresh(body: {
        refreshToken: string;
    }): {
        data: {
            accessToken: string;
            expiresInSeconds: number;
        };
    };
}
//# sourceMappingURL=auth.controller.d.ts.map