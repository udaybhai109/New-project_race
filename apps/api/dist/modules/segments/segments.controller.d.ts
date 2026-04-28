import { LeaderboardsService } from "../leaderboards/leaderboards.service";
import { SegmentsService } from "./segments.service";
export declare class SegmentsController {
    private readonly segmentsService;
    private readonly leaderboardsService;
    constructor(segmentsService: SegmentsService, leaderboardsService: LeaderboardsService);
    findOne(id: string): {
        data: {
            id: string;
            name: string;
            city: string;
            distanceMeters: number;
        };
    };
    leaderboard(id: string): {
        data: import("@stride-x/domain-types").LeaderboardSlice;
    };
}
//# sourceMappingURL=segments.controller.d.ts.map