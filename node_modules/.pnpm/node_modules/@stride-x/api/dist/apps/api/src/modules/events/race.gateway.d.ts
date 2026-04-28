import type { LiveSpectatorPosition } from "@stride-x/domain-types";
import type { Socket } from "socket.io";
export declare class RaceGateway {
    private server?;
    joinRace(body: {
        raceId: string;
    }, client: Socket): void;
    publishPosition(position: LiveSpectatorPosition): void;
}
//# sourceMappingURL=race.gateway.d.ts.map