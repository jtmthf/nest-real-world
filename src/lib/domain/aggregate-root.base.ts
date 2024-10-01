import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from './domain-event.base';
import { AggregateID, Entity } from './entity.base';

export abstract class AggregateRoot<
  ID extends AggregateID,
  Props,
> extends Entity<ID, Props> {
  #domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this.#domainEvents;
  }

  addEvent(event: DomainEvent): void {
    this.#domainEvents.push(event);
  }

  clearEvents(): void {
    this.#domainEvents = [];
  }

  async publishEvents(eventEmitter: EventEmitter2): Promise<void> {
    await Promise.all(
      this.#domainEvents.map(async (event) => {
        Logger.log(
          `${event.constructor.name} event published for ${this.constructor.name} : ${this.id}`,
        );
        await eventEmitter.emitAsync(event.constructor.name, event);
      }),
    );
    this.clearEvents();
  }
}
