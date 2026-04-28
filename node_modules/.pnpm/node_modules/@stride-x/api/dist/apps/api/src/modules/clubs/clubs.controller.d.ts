import { ClubsService } from "./clubs.service";
export declare class ClubsController {
    private readonly clubsService;
    constructor(clubsService: ClubsService);
    list(): {
        data: {
            id: string;
            name: string;
            memberCount: number;
        }[];
    };
    findOne(id: string): {
        data: {
            id: string;
            name: string;
            memberCount: number;
        };
    };
}
//# sourceMappingURL=clubs.controller.d.ts.map