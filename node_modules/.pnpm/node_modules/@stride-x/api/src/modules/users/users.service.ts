import { Injectable } from "@nestjs/common";
import { InMemoryDb } from "../../platform/in-memory-db.service";

@Injectable()
export class UsersService {
  constructor(private readonly db: InMemoryDb) {}

  me() {
    return this.db.users[0];
  }
}

