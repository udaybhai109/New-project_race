import { BillingService } from "./billing.service";
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    entitlements(userId: string): {
        data: {
            userId: string;
            tier: string;
            features: string[];
        };
    };
    stripeWebhook(body: Record<string, unknown>): {
        data: {
            accepted: boolean;
            eventType: unknown;
        };
    };
}
//# sourceMappingURL=billing.controller.d.ts.map