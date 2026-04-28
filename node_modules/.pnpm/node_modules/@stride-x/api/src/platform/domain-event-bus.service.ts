import { Injectable } from "@nestjs/common";
import { EventEmitter } from "node:events";

@Injectable()
export class DomainEventBus {
  private readonly emitter = new EventEmitter();

  emit<T>(event: string, payload: T) {
    if (event.includes(".")) {
      console.log(`[EVENT] ${event}`);
    }
    this.emitter.emit(event, payload);
  }

  on<T>(event: string, handler: (payload: T) => void) {
    this.emitter.on(event, handler);
  }
}
