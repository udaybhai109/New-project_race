import { InMemoryDb } from "../../platform/in-memory-db.service";
export declare class UsersService {
    private readonly db;
    constructor(db: InMemoryDb);
    me(): import("@stride-x/domain-types").UserProfile;
}
//# sourceMappingURL=users.service.d.ts.map