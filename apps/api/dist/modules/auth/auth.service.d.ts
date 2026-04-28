export declare class AuthService {
    login(email: string): {
        accessToken: string;
        refreshToken: string;
        userId: string;
    };
    oauth(provider: "google" | "apple", code: string): {
        provider: "google" | "apple";
        code: string;
        accessToken: string;
        userId: string;
    };
}
//# sourceMappingURL=auth.service.d.ts.map