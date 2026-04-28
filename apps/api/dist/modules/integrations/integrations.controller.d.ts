import type { IntegrationConnection } from "@stride-x/domain-types";
import { IntegrationsService } from "./integrations.service";
export declare class IntegrationsController {
    private readonly integrationsService;
    constructor(integrationsService: IntegrationsService);
    list(userId: string): {
        data: IntegrationConnection[];
    };
    connect(body: Pick<IntegrationConnection, "userId" | "provider" | "scopes">): {
        data: IntegrationConnection;
    };
}
//# sourceMappingURL=integrations.controller.d.ts.map