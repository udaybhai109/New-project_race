import { Injectable } from "@nestjs/common";
import { InMemoryDb } from "../../platform/in-memory-db.service";

@Injectable()
export class ValidationService {
  constructor(private readonly db: InMemoryDb) {}

  getVerdict(activityId: string) {
    return this.db.validationVerdicts.find((verdict) => verdict.activityId === activityId) ?? null;
  }
}
