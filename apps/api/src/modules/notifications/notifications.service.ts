import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  queuePush(topic: string, payload: Record<string, unknown>) {
    return { queued: true, topic, payload };
  }
}

