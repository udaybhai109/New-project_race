import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { LiveSpectatorPosition } from "@stride-x/domain-types";
import type { Server, Socket } from "socket.io";

@WebSocketGateway({ namespace: "race", cors: true })
export class RaceGateway {
  @WebSocketServer()
  private server?: Server;

  @SubscribeMessage("race.join")
  joinRace(@MessageBody() body: { raceId: string }, @ConnectedSocket() client: Socket) {
    client.join(`race:${body.raceId}`);
    client.emit("race.joined", { raceId: body.raceId });
  }

  publishPosition(position: LiveSpectatorPosition) {
    this.server?.to(`race:${position.raceId}`).emit("race.position", position);
    console.log("[RACE] position broadcast");
  }
}
