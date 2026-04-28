import { InMemoryDb } from "../../platform/in-memory-db.service";
export declare class ValidationService {
    private readonly db;
    constructor(db: InMemoryDb);
    getVerdict(activityId: string): import("@stride-x/domain-types").ValidationVerdict;
}
//# sourceMappingURL=validation.service.d.ts.map