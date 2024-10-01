import { RequestContextService } from '../application/context/app-request-context';

type DomainEventMetadata = {
  /** Timestamp when this domain event occurred */
  readonly timestamp: number;

  /** Request ID used to track the request */
  readonly requestId?: string;

  /** ID for correlation purposes (for Integration Events,logs correlation, etc). */
  readonly correlationId: string;

  /** Causation id used to reconstruct execution order if needed */
  readonly causationId?: string;

  /** User ID for debugging and logging purposes */
  readonly userId?: string;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string;
  metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
  readonly #id: string;
  readonly #aggregateId: string;
  readonly #metadata: DomainEventMetadata;

  constructor({ aggregateId, metadata }: DomainEventProps<DomainEvent>) {
    this.#id = crypto.randomUUID();
    this.#aggregateId = aggregateId;
    this.#metadata = Object.freeze({
      requestId: metadata?.requestId ?? RequestContextService.getRequestId(),
      correlationId:
        metadata?.correlationId ?? RequestContextService.getCorrelationId(),
      causationId: metadata?.causationId,
      timestamp: metadata?.timestamp ?? Date.now(),
      userId: metadata?.userId,
    });
  }

  get id(): string {
    return this.#id;
  }

  get aggregateId(): string {
    return this.#aggregateId;
  }

  get metadata(): DomainEventMetadata {
    return this.#metadata;
  }
}
