import { Injectable } from "@nestjs/common";

@Injectable()
export class ClubsService {
  list() {
    return [
      { id: "club_mumbai_runners", name: "Mumbai Runners", memberCount: 412 },
      { id: "club_hyrox_india", name: "Hyrox India", memberCount: 166 }
    ];
  }

  findOne(clubId: string) {
    return this.list().find((club) => club.id === clubId) ?? null;
  }
}

