import { Injectable } from "@nestjs/common";
import type { CheerEvent, EventStatus, LiveSpectatorPosition, RaceTimingEvent } from "@stride-x/domain-types";
import { eventTopics } from "@stride-x/eventing";
import { DomainEventBus } from "../../platform/domain-event-bus.service";
import { createId } from "../../platform/id";
import { InMemoryDb } from "../../platform/in-memory-db.service";
import { RaceGateway } from "./race.gateway";

type RaceCheckpoint = {
  id: string;
  lat: number;
  lng: number;
};

const CHECKPOINT_REACHED_THRESHOLD_METERS = 50;

@Injectable()
export class EventsService {
  constructor(
    private readonly db: InMemoryDb,
    private readonly eventBus: DomainEventBus,
    private readonly raceGateway: RaceGateway
  ) {}

  list() {
    return [
      {
        id: "event_mumbai_half_2026",
        name: "Mumbai Half Marathon 2026",
        status: "published" as EventStatus,
        city: "Mumbai"
      }
    ];
  }

  ingestTimingEvent(payload: RaceTimingEvent) {
    this.db.timingEvents.push(payload);
    this.eventBus.emit("event.timing.ingested", payload);
    this.eventBus.emit(eventTopics.eventTimingIngested, {
      timing: payload,
      triggeredAt: new Date().toISOString()
    });
    return { queued: true };
  }

  startLiveRace(eventId: string, checkpoints?: RaceCheckpoint[]) {
    const session = {
      eventId,
      status: "live" as const,
      startedAt: new Date().toISOString()
    };

    this.db.liveRaceSessions.set(eventId, session);
    this.db.raceCheckpoints.set(eventId, checkpoints?.length ? checkpoints : this.defaultCheckpoints(eventId));

    return {
      ...session,
      checkpoints: this.db.raceCheckpoints.get(eventId)
    };
  }

  getLiveRace(eventId: string) {
    return {
      session: this.db.liveRaceSessions.get(eventId) ?? null,
      checkpoints: this.db.raceCheckpoints.get(eventId) ?? [],
      leaderboard: this.getRaceLeaderboard(eventId).standings,
      positions: this.db.livePositions.filter((position) => position.raceId === eventId)
    };
  }

  upsertLivePosition(position: LiveSpectatorPosition) {
    this.db.livePositions.push(position);
    const progress = this.updateCheckpointProgress(position);
    this.raceGateway.publishPosition(position);
    this.eventBus.emit("event.live_position.ingested", position);
    this.eventBus.emit(eventTopics.eventLivePositionIngested, {
      position,
      triggeredAt: new Date().toISOString()
    });

    return {
      ...position,
      progress
    };
  }

  getRaceLeaderboard(eventId: string) {
    const standings = Array.from(this.db.raceProgress.get(eventId)?.values() ?? [])
      .sort((left, right) => {
        if (right.checkpointCount !== left.checkpointCount) {
          return right.checkpointCount - left.checkpointCount;
        }

        const leftUpdatedAt = new Date(left.lastUpdated).getTime();
        const rightUpdatedAt = new Date(right.lastUpdated).getTime();
        if (leftUpdatedAt !== rightUpdatedAt) {
          return leftUpdatedAt - rightUpdatedAt;
        }

        return left.athleteId.localeCompare(right.athleteId);
      })
      .map((progress) => ({
        athleteId: progress.athleteId,
        checkpointCount: progress.checkpointCount,
        lastCheckpointId: progress.lastCheckpointId,
        lastUpdated: progress.lastUpdated
      }));

    return { standings };
  }

  createCheer(input: Omit<CheerEvent, "id" | "createdAt">) {
    const cheer: CheerEvent = {
      ...input,
      id: createId("cheer"),
      createdAt: new Date().toISOString()
    };

    this.db.cheers.push(cheer);
    this.eventBus.emit("event.cheer.created", cheer);
    this.eventBus.emit(eventTopics.cheerBroadcastRequested, {
      cheer,
      triggeredAt: cheer.createdAt
    });
    return cheer;
  }

  spectatorView(eventId: string) {
    return {
      eventId,
      status: "live",
      liveAthleteIds: this.db.livePositions.filter((item) => item.raceId === eventId).map((item) => item.athleteId)
    };
  }

  private updateCheckpointProgress(position: LiveSpectatorPosition) {
    const checkpoints = this.db.raceCheckpoints.get(position.raceId) ?? this.defaultCheckpoints(position.raceId);
    this.db.raceCheckpoints.set(position.raceId, checkpoints);

    const reached = this.findReachedCheckpoint(position, checkpoints);
    const raceProgress = this.db.raceProgress.get(position.raceId) ?? new Map();
    const previous = raceProgress.get(position.athleteId);
    const checkpointIndex = reached ? checkpoints.findIndex((checkpoint) => checkpoint.id === reached.id) : -1;
    const previousIndex = previous?.lastCheckpointId
      ? checkpoints.findIndex((checkpoint) => checkpoint.id === previous.lastCheckpointId)
      : -1;
    const shouldAdvance = checkpointIndex > previousIndex;
    const checkpointCount = shouldAdvance ? checkpointIndex + 1 : previous?.checkpointCount ?? 0;

    const progress = {
      athleteId: position.athleteId,
      lastCheckpointId: shouldAdvance ? reached.id : previous?.lastCheckpointId ?? null,
      checkpointCount,
      lastUpdated: position.recordedAt ?? new Date().toISOString()
    };

    raceProgress.set(position.athleteId, progress);
    this.db.raceProgress.set(position.raceId, raceProgress);

    return progress;
  }

  private findReachedCheckpoint(position: LiveSpectatorPosition, checkpoints: RaceCheckpoint[]) {
    return checkpoints
      .map((checkpoint) => ({
        checkpoint,
        distance: this.calculateDistance(position.lat, position.lng, checkpoint.lat, checkpoint.lng)
      }))
      .filter((candidate) => candidate.distance <= CHECKPOINT_REACHED_THRESHOLD_METERS)
      .sort((left, right) => left.distance - right.distance)[0]?.checkpoint ?? null;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const earthRadiusMeters = 6371000;
    const deltaLat = this.toRadians(lat2 - lat1);
    const deltaLng = this.toRadians(lng2 - lng1);
    const fromLat = this.toRadians(lat1);
    const toLat = this.toRadians(lat2);
    const haversine =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  private toRadians(value: number) {
    return (value * Math.PI) / 180;
  }

  private defaultCheckpoints(eventId: string): RaceCheckpoint[] {
    return [
      { id: "cp1", lat: 19.076, lng: 72.8777 },
      { id: "cp2", lat: 19.08, lng: 72.88 }
    ].map((checkpoint) => ({ ...checkpoint, id: `${eventId}:${checkpoint.id}` }));
  }
}
