import { Injectable } from "@nestjs/common";

@Injectable()
export class SegmentsService {
  findOne(segmentId: string) {
    return {
      id: segmentId,
      name: "Marine Drive Sprint",
      city: "Mumbai",
      distanceMeters: 1000
    };
  }
}

