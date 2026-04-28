export declare class DashboardView {
    feedIds: string[];
    activeChallenges: string[];
    upcomingEventIds: string[];
}
export declare class GraphqlLeaderboardEntry {
    athleteId: string;
    athleteName: string;
    rank: number;
    score: number;
    statLabel: string;
}
export declare class GraphqlLeaderboardSlice {
    scopeId: string;
    label: string;
    top: GraphqlLeaderboardEntry[];
    updatedAt: string;
}
export declare class GraphqlActivityDetail {
    id: string;
    title: string;
    type: string;
    distanceMeters: number;
    movingTimeSeconds: number;
}
export declare class GraphqlClubView {
    id: string;
    name: string;
    memberCount: number;
}
export declare class GraphqlEventSpectatorView {
    eventId: string;
    status: string;
    liveAthleteIds: string[];
}
export declare class GraphqlInsight {
    id: string;
    title: string;
    summary: string;
}
//# sourceMappingURL=models.d.ts.map