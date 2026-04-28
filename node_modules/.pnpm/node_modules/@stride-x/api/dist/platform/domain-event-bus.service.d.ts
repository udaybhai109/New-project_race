export declare class DomainEventBus {
    private readonly emitter;
    emit<T>(event: string, payload: T): void;
    on<T>(event: string, handler: (payload: T) => void): void;
}
//# sourceMappingURL=domain-event-bus.service.d.ts.map